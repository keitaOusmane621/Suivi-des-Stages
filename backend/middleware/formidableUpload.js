const { IncomingForm } = require('formidable');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/applications';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadApplicationFiles = (req, res, next) => {
  console.log('🔍 [formidable] Content-Type:', req.headers['content-type']);
  console.log('🔍 [formidable] URL:', req.url);

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    multiples: false,
    filename: (name, ext, part) => {
      return Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    }
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('❌ [formidable] Erreur:', err);
      return next(err);
    }

    console.log('📥 [formidable] Fields:', fields);
    console.log('📎 [formidable] Files:', files);

    // Reformater pour le contrôleur
    req.body = fields;
    req.files = {};

    // Transformer chaque champ de fichiers en un tableau d'objets
    for (const [key, value] of Object.entries(files)) {
      const fileArray = Array.isArray(value) ? value : [value];
      req.files[key] = fileArray.map(f => ({
        fieldname: key,
        originalname: f.originalFilename || f.name || 'unknown',
        encoding: f.encoding || '7bit',
        mimetype: f.mimetype || f.type || 'application/octet-stream',
        path: f.filepath || f.path,
        size: f.size || 0
      }));
    }

    console.log('✅ [formidable] req.files reformaté:', req.files);

    next();
  });
};