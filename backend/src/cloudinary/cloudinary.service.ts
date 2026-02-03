import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { resolve } from 'path';
import * as streamifier from "streamifier"

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File):Promise<UploadApiResponse| UploadApiErrorResponse>{
        return new Promise((resolve,reject)=>{
        const upload = cloudinary.uploader.upload_stream({
            folder:'shopping_appproducts',
            transformation:[{width:500,height:500,crop:'limit'}]
        },
        (error,result)=>{
            if(error) return reject(error)
            if(!result) return reject(new Error('Cloudinary upload returned no result'))
            resolve(result)
        },
    )
    streamifier.createReadStream(file.buffer).pipe(upload)
        })
    }
}
