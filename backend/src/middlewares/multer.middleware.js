// where ever file upload will be required, we will inject this Middleware their, like in registration we will do, in login we will not do.

import multer from "multer"
import path from "path"

// storing in diskStorage not in memoryStorage.
const storage = multer.diskStorage({

    //destination where to upload
    destination: function (req, file, cb) {
        // by default callback's first argument is error(so we keep it null), second is destination path
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname)
        const sanitizedBaseName = path
            .basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .slice(0, 60)

        cb(null, `${Date.now()}-${sanitizedBaseName}${extension}`)
    }
})

export const upload = multer({
    storage,
})

// after running this middleware we fetch access to "req.files" and "req.file"