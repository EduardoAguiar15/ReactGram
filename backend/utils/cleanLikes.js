// // utils/cleanLikes.js
// require("dotenv").config();
// const mongoose = require("mongoose");
// const Photo = require("../models/Photo");

// const cleanLikes = async () => {
//   try {
//     console.log("Iniciando limpeza de likes...");

//     if (mongoose.connection.readyState === 0) {
//       await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//     }

//     const photos = await Photo.find({});
//     console.log(`Encontradas ${photos.length} fotos.`);

//     for (const photo of photos) {
//       // Apaga todos os likes da foto
//       photo.likes = [];

//       // Apaga todos os likes de comentários
//       if (photo.comments && photo.comments.length > 0) {
//         for (const comment of photo.comments) {
//           comment.likes = [];

//           // Se houver replies com likes
//           if (comment.replies && comment.replies.length > 0) {
//             for (const reply of comment.replies) {
//               reply.likes = [];
//             }
//           }
//         }
//       }

//       await photo.save();
//     }

//     console.log("Todos os likes foram apagados com sucesso!");
//     await mongoose.disconnect();
//   } catch (err) {
//     console.error("Erro ao limpar likes:", err);
//     try { await mongoose.disconnect(); } catch (e) {}
//   }
// };

// // Permite rodar diretamente pelo node
// if (require.main === module) {
//   cleanLikes().then(() => process.exit(0));
// }

// module.exports = cleanLikes;
