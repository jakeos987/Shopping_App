import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [{
    provide: 'CLOUDINARY',
    useFactory: (configS: ConfigService)=>{
        return cloudinary.config({
            cloude_Name:configS.get('CLOUDINARY_CLOUD_NAME'),
            api_key: configS.get('CLOUDINARY_API_KEY'),
            api_secret: configS.get('CLOUDINARY_API_SECRET')
        })
    },
    inject:[ConfigService]
  },
  CloudinaryService
],
exports:[CloudinaryService, 'CLOUDINARY']
})
export class CloudinaryModule {}
