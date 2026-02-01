const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Comment = require("../models/Comment");
const path = require("path");
const { hashPassword } = require("../utils/hash");

describe("Comment Controller", () => {

    async function createUserAndLogin(email = "test@test.com") {
        await User.create({
            name: "Carlos",
            email,
            password: await hashPassword("123456")
        });

        const loginRes = await request(app)
            .post("/api/users/login")
            .send({ email, password: "123456" });

        return loginRes.body.token;
    }

    async function insertPhoto(token) {
        const imagePath = path.join(__dirname, "uploads", "test-photo.jpeg");

        const res = await request(app)
            .post("/api/photos/insert")
            .set("authorization", `Bearer ${token}`)
            .field("title", "Foto teste")
            .attach("image", imagePath);

        return res.body;
    }

    // CRIAR COMENTÁRIO
    it("deve criar um comentário com sucesso", async () => {
        const token = await createUserAndLogin("comment@test.com");
        const photo = await insertPhoto(token);

        const res = await request(app)
            .post(`/api/comments/${photo._id}`)
            .set("authorization", `Bearer ${token}`)
            .send({ comment: "Comentário teste" });

        expect(res.status).toBe(201);
        expect(res.body.message).toMatch(/comentário/i);
        expect(res.body.comment).toBe("Comentário teste");

        const comments = await Comment.find({ photoId: photo._id });
        expect(comments.length).toBe(1);
        expect(comments[0].comment).toBe("Comentário teste");
    });

    // FALHA AO COMENTAR FOTO INEXISTENTE
    it("não deve permitir comentar uma foto que não existe", async () => {
        const token = await createUserAndLogin("photofail@test.com");

        const fakePhotoId = "507f1f77bcf86cd799439012";

        const res = await request(app)
            .post(`/api/comments/${fakePhotoId}`)
            .set("authorization", `Bearer ${token}`)
            .send({ comment: "Comentário inválido" });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Erro ao criar comentário");

        const comments = await Comment.find({});
        expect(comments.length).toBe(0);
    });

    // RESPONDER COMENTÁRIO
    it("deve responder um comentário", async () => {
        const token = await createUserAndLogin("reply@test.com");
        const photo = await insertPhoto(token);

        const commentRes = await request(app)
            .post(`/api/comments/${photo._id}`)
            .set("authorization", `Bearer ${token}`)
            .send({ comment: "Comentário pai" });

        const parent = await Comment.findOne({ photoId: photo._id });

        const replyRes = await request(app)
            .post(`/api/comments/${photo._id}`)
            .set("authorization", `Bearer ${token}`)
            .send({
                comment: "Resposta",
                replyTo: parent._id
            });

        expect(replyRes.status).toBe(201);
        expect(replyRes.body.message).toMatch(/resposta/i);

        const updated = await Comment.findById(parent._id);
        expect(updated.replies.length).toBe(1);
        expect(updated.replies[0].comment).toBe("Resposta");
    });

    // FALHA AO RESPONDER COMENTÁRIO INEXISTENTE
    it("não deve permitir responder um comentário que não existe", async () => {
        const token = await createUserAndLogin("notfound@test.com");
        const photo = await insertPhoto(token);

        const fakeCommentId = "507f1f77bcf86cd799439011";

        const res = await request(app)
            .post(`/api/comments/${photo._id}`)
            .set("authorization", `Bearer ${token}`)
            .send({
                comment: "Tentando responder",
                replyTo: fakeCommentId
            });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Erro ao criar comentário");

        const comments = await Comment.find({ photoId: photo._id });
        expect(comments.length).toBe(0);
    });

    // FALHA AO CRIAR COMENTÁRIO VAZIO
    it("não deve permitir comentário vazio", async () => {
        const token = await createUserAndLogin("empty@test.com");
        const photo = await insertPhoto(token);

        const res = await request(app)
            .post(`/api/comments/${photo._id}`)
            .set("authorization", `Bearer ${token}`)
            .send({ comment: "" });

        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Erro ao criar comentário");
    });

    // CURTIR COMENTÁRIO
    it("deve curtir e descurtir um comentário", async () => {
        const token = await createUserAndLogin("likecomment@test.com");
        const photo = await insertPhoto(token);

        await request(app)
            .post(`/api/comments/${photo._id}`)
            .set("authorization", `Bearer ${token}`)
            .send({ comment: "Curtir isso" });

        const comment = await Comment.findOne({ photoId: photo._id });

        const likeRes = await request(app)
            .put(`/api/comments/${comment._id}/like`)
            .set("authorization", `Bearer ${token}`);

        expect(likeRes.status).toBe(200);
        expect(likeRes.body.liked).toBe(true);

        const unlikeRes = await request(app)
            .put(`/api/comments/${comment._id}/like`)
            .set("authorization", `Bearer ${token}`);

        expect(unlikeRes.body.liked).toBe(false);
    });

    // BUSCAR COMENTÁRIOS
    it("deve buscar todos os comentários de uma foto", async () => {

        const token = await createUserAndLogin();
        const photo = await insertPhoto(token);

        await request(app)
            .post(`/api/comments/${photo._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ comment: "Primeiro comentário" });

        await request(app)
            .post(`/api/comments/${photo._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ comment: "Segundo comentário" });

        const res = await request(app)
            .get(`/api/comments/${photo._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    // BUSCAR TODOS OS COMENTÁRIOS DO SISTEMA
    it("deve buscar todos os comentários do sistema", async () => {

        const token = await createUserAndLogin();

        const photo1 = await insertPhoto(token);
        const photo2 = await insertPhoto(token);

        await request(app)
            .post(`/api/comments/${photo1._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ comment: "Comentário da foto 1" });

        await request(app)
            .post(`/api/comments/${photo2._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ comment: "Comentário da foto 2" });

        const res = await request(app)
            .get("/api/comments")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
});