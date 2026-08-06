module.exports = (req, res, next) => {
  console.log('📋 Content-Type:', req.headers['content-type']);
  console.log('📋 Méthode:', req.method);
  console.log('📋 URL:', req.url);
  next();
};