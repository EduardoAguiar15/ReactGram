class AppError extends Error {
    constructor(userMessage, status = 500, details) {
        super(userMessage);
        this.status = status;
        this.userMessage = userMessage;
        this.details = details || [userMessage];
    }
}

class InvalidIdError extends AppError {
    constructor() {
        super("ID inválido.", 400);
    }
}

class CreateMessageError extends AppError {
    constructor() {
        super("receiverId e text são obrigatórios.", 400);
    }
}

class ForbiddenError extends AppError {
    constructor() {
        super("Você não tem permissão para realizar esta ação.", 403);
    }
}

class UserNotFoundError extends AppError {
    constructor() {
        super("Usuário não encontrado.", 404);
    }
}

class PhotoNotFoundError extends AppError {
    constructor() {
        super("Foto não encontrada.", 404);
    }
}

class CommentNotFoundError extends AppError {
    constructor() {
        super("Comentário não encontrado.", 404);
    }
}

class UnprocessableEntityError extends AppError {
    constructor(message = "Dados inválidos ou incompletos.") {
        super(message, 422);
    }
}

class CreatePhotoError extends AppError {
    constructor() {
        super("Erro ao criar foto.", 500);
    }
}

class LoginError extends AppError {
    constructor() {
        super("Erro no login, tente novamente.", 500);
    }
}

module.exports = {
    AppError,
    InvalidIdError,
    CreateMessageError,
    ForbiddenError,
    UserNotFoundError,
    PhotoNotFoundError,
    CommentNotFoundError,
    UnprocessableEntityError,
    CreatePhotoError,
    LoginError
};