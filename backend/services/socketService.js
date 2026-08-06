const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log('🔌 Nouveau client connecté:', socket.id);

    // Rejoindre la room de l'utilisateur
    socket.on('join-user', (userId) => {
      socket.join(userId.toString());
      console.log(`👤 Utilisateur ${userId} a rejoint sa room`);
      socket.emit('connected', { userId, socketId: socket.id });
    });

    // Rejoindre une conversation
    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId.toString());
      console.log(`💬 Socket ${socket.id} a rejoint la conversation ${conversationId}`);
    });

    // Quitter une conversation
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId.toString());
    });

    // Indicateur de frappe
    socket.on('typing', ({ conversationId, userId, userName }) => {
      socket.to(conversationId.toString()).emit('user-typing', {
        userId,
        userName,
        isTyping: true
      });
    });

    // Arrêt de frappe
    socket.on('stopped-typing', ({ conversationId, userId }) => {
      socket.to(conversationId.toString()).emit('user-typing', {
        userId,
        isTyping: false
      });
    });

    // Message en temps réel
    socket.on('send-message', (data) => {
      const { conversationId, message } = data;
      socket.to(conversationId.toString()).emit('receive-message', message);
    });

    // Gestion de la déconnexion
    socket.on('disconnect', (reason) => {
      console.log(`❌ Client déconnecté: ${socket.id} - ${reason}`);
    });

    // Gestion des erreurs
    socket.on('error', (error) => {
      console.error('❌ Erreur Socket.io:', error);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO non initialisé');
  }
  return io;
};

const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId.toString()).emit(event, data);
  }
};

const emitToConversation = (conversationId, event, data) => {
  if (io) {
    io.to(conversationId.toString()).emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitToUser,
  emitToConversation
};