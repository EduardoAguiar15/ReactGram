const request = require("supertest");
const app = require("../app");
const Photo = require("../models/Photo");
const User = require("../models/User");
const mongoose = require("mongoose");
const path = require("path");
const { hashPassword } = require("../utils/hash");

describe("Photo Controller", () => {

    async function createUserAndLogin({
        email,
        password = "123456",
        name,
        bio
    }) {
        const user = await User.create({
            name: name || email.split("@")[0],
            email,
            password: await hashPassword(password),
            ...(bio && { bio })
        });

        const loginRes = await request(app)
            .post("/api/users/login")
            .send({ email, password });

        return {
            user,
            token: loginRes.body.token
        };
    }


    async function insertPhoto(token, title = "Foto teste") {
        const imagePath = path.join(__dirname, "uploads", "test-photo.jpeg");

        const res = await request(app)
            .post("/api/photos/insert")
            .set("authorization", `Bearer ${token}`)
            .field("title", title)
            .attach("image", imagePath);

        return res;
    }


    // PUBLICAR FOTO
    it("deve publicar uma foto com sucesso", async () => {
        const { token } = await createUserAndLogin({
            email: "carlos@test.com"
        })

        const photo = await insertPhoto(token, "Testando foto");
        expect(photo.status).toBe(201);
        expect(photo.body).toHaveProperty("_id");
        expect(photo.body.title).toBe("Testando foto");

        const photoDb = await Photo.findById(photo.body._id);
        expect(photoDb).not.toBeNull();
    });


    // FALHA AO PUBLICAR FOTO SEM TÍTULO
    it("não deve permitir publicar foto sem título", async () => {
        const { token } = await createUserAndLogin({
            email: "carlos@test.com"
        })

        const res = await insertPhoto(token, "");

        expect(res.status).toBe(422);
        expect(res.body.errors[0]).toMatch(/O Título precisa ter no mínimo 3 caracteres/i);

    });


    // FALHA AO PUBLICAR FOTO SEM IMAGEM
    it("não deve permitir publicar foto sem imagem", async () => {
        const { token } = await createUserAndLogin({
            email: "noimage@test.com"
        });

        const res = await request(app)
            .post("/api/photos/insert")
            .set("authorization", `Bearer ${token}`)
            .field("title", "Foto sem imagem");

        expect(res.status).toBe(422);
        expect(res.body.errors).toContain("A imagem é obrigatória.");
    });


    // FALHA AO PUBLICAR FOTO SEM ESTAR AUTENTICADO
    it("não deve permitir publicar foto sem estar autenticado", async () => {
        const res = await request(app)
            .post("/api/photos/insert")
            .field("title", "Foto sem token");

        expect(res.status).toBe(401);
        expect(res.body.errors[0]).toMatch(/acesso negado/i);
    });


    // ATUALIZAR FOTO
    it("deve atualizar photo com sucesso", async () => {
        const { token } = await createUserAndLogin({
            email: "update@test.com",
            name: "Carlos Atualizado",
            bio: "Bio nova"
        });

        const photo = await insertPhoto(token, "Testando foto");

        expect(photo.status).toBe(201);
        expect(photo.body).toHaveProperty("_id");
        expect(photo.body).toHaveProperty("image");
        expect(photo.body.title).toBe("Testando foto");

        const res = await request(app)
            .put(`/api/photos/${photo.body._id}`)
            .set("authorization", `Bearer ${token}`)
            .send({
                title: "Foto atualizada"

            });

        expect(res.status).toBe(200);
        expect(res.body.photo.title).toBe("Foto atualizada");
        expect(res.body.photo).toHaveProperty("image");
    });


    // FALHA AO ATUALIZAR FOTO DE OUTRO USUÁRIO
    it("não deve permitir atualizar foto de outro usuário", async () => {
        const { token: token1 } = await createUserAndLogin({
            email: "usuario1@test.com",
            name: "Usuario1"
        });

        const photo = await insertPhoto(token1, "Foto do Usuario1");

        expect(photo.status).toBe(201);

        const user2 = await createUserAndLogin({
            email: "usuario2@test.com",
            name: "Usuario2"
        });

        const res = await request(app)
            .put(`/api/photos/${photo.body._id}`)
            .set("authorization", `Bearer ${user2.token}`)
            .send({ title: "Tentativa de update por outro usuário" });

        expect(res.status).toBe(403);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Erro ao atualizar foto");

    });


    // FALHA AO ATUALIZAR FOTO SEM ESTAR AUTENTICADO
    it("não deve permitir atualizar foto sem estar autenticado", async () => {
        const { token } = await createUserAndLogin({
            email: "teste@test.com"
        });

        const photo = await insertPhoto(token, "Foto original");

        expect(photo.status).toBe(201);

        const photoId = photo.body._id;

        const res = await request(app)
            .put(`/api/photos/${photoId}`)
            .send({ title: "Tentativa sem token" });

        expect(res.status).toBe(401);
        expect(res.body.errors[0]).toMatch(/acesso negado/i);
    });


    // LISTAR FOTOS DE UM USUÁRIO
    it("deve retornar todas as fotos de um usuário", async () => {
        const { user, token } = await createUserAndLogin({
            email: "teste@test.com"
        });

        const photo1 = await insertPhoto(token, "Primeira foto");

        expect(photo1.status).toBe(201);

        const photo2 = await insertPhoto(token, "Segunda foto");

        expect(photo2.status).toBe(201);

        const res = await request(app)
            .get(`/api/photos/user/${user._id}`)
            .set("authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);

        expect(res.body[0].title).toBe("Segunda foto");
        expect(res.body[1].title).toBe("Primeira foto");

        res.body.forEach(photo => {
            expect(photo.userId._id).toBe(String(user._id));
        });
    });


    // BUSCAR FOTO POR ID
    it("deve buscar foto por ID com sucesso", async () => {
        await User.create({
            name: "Carlos Busca",
            email: "carlosbusca@test.com",
            password: await require("../utils/hash").hashPassword("123456"),
        });

        const loginRes = await request(app)
            .post("/api/users/login")
            .send({
                email: "carlosbusca@test.com",
                password: "123456"
            });

        const token = loginRes.body.token;

        const photo = await insertPhoto(token, "Foto para busca");

        expect(photo.status).toBe(201);

        const res = await request(app)
            .get(`/api/photos/${photo.body._id}`)
            .set("authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("title", "Foto para busca");
        expect(res.body).toHaveProperty("image");
    });


    // BUSCAR FOTO COM ID INVÁLIDO
    it("não deve permitir buscar foto com ID inválido", async () => {
        const { token } = await createUserAndLogin({
            email: "teste@test.com"
        });

        const res = await request(app)
            .get("/api/photos/123")
            .set("authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Erro ao buscar foto");
    });


    // DELETAR FOTO
    it("deve deletar uma foto com sucesso", async () => {
        const { token } = await createUserAndLogin({
            email: "teste@test.com"
        });

        const photo = await insertPhoto(token, "Foto para deletar");

        expect(photo.status).toBe(201);

        const res = await request(app)
            .delete(`/api/photos/${photo.body._id}`)
            .set("authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Foto excluída com sucesso!");

        const photoDb = await Photo.findById(photo.body._id);
        expect(photoDb).toBeNull();
    });

    // FALHA AO DELETAR FOTO INEXISTENTE
    it("não deve permitir deletar foto inexistente", async () => {
        const { token } = await createUserAndLogin({
            email: "teste@test.com"
        });

        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .delete(`/api/photos/${fakeId}`)
            .set("authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Erro ao deletar foto");
    });


    // FALHA AO DELETAR FOTO SEM ESTAR AUTENTICADO
    it("não deve permitir deletar foto sem estar autenticado", async () => {
        const { token } = await createUserAndLogin({
            email: "teste@test.com"
        });

        const photo = await insertPhoto(token, "Foto para deletar");

        expect(photo.status).toBe(201);

        const photoId = photo.body._id;

        const res = await request(app)
            .delete(`/api/photos/${photoId}`);

        expect(res.status).toBe(401);
        expect(res.body.errors[0]).toMatch(/acesso negado/i);
    });


    // TESTE PARA LIKEPHOTO
    it("deve permitir curtir e descurtir uma foto", async () => {
        const { user, token } = await createUserAndLogin({
            email: "teste@test.com"
        });

        const photo = await insertPhoto(token, "Foto para like");

        expect(photo.status).toBe(201);

        const photoId = photo.body._id;

        const likeRes = await request(app)
            .put(`/api/photos/${photoId}/like`)
            .set("authorization", `Bearer ${token}`);

        expect(likeRes.status).toBe(200);
        expect(likeRes.body.liked).toBe(true);
        expect(likeRes.body.photoId).toBe(photoId);

        const photoDb = await Photo.findById(photoId);
        expect(photoDb.likes.map(id => String(id))).toContain(String(user._id));

        const unlikeRes = await request(app)
            .put(`/api/photos/${photoId}/like`)
            .set("authorization", `Bearer ${token}`);

        expect(unlikeRes.status).toBe(200);
        expect(unlikeRes.body.liked).toBe(false);
        expect(unlikeRes.body.photoId).toBe(photoId);

        const photoDbAfter = await Photo.findById(photoId);
        expect(photoDbAfter.likes).not.toContain(String(user._id));
    });


    // FALHA AO CURTIR FOTO SEM ESTAR AUTENTICADO
    it("não deve permitir curtir foto sem estar autenticado", async () => {
        const { token } = await createUserAndLogin({
            email: "teste@test.com"
        });

        const photo = await insertPhoto(token, "Foto para like");

        expect(photo.status).toBe(201);

        const photoId = photo.body._id;
        const res = await request(app)
            .put(`/api/photos/${photoId}/like`);

        expect(res.status).toBe(401);
        expect(res.body.errors[0]).toMatch(/acesso negado/i);
    });
});