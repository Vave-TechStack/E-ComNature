package com.ecom.backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Value("${app.aws.access-key:}")
    private String awsAccessKey;

    @Value("${app.aws.secret-key:}")
    private String awsSecretKey;

    @Value("${app.aws.s3.bucket:ecom-nature}")
    private String s3Bucket;

    private final S3Client s3Client;

    public FileStorageService() {
        // Initialize S3 client only if credentials are available
        if (awsAccessKey != null && !awsAccessKey.isEmpty()) {
            this.s3Client = S3Client.builder().build();
        } else {
            this.s3Client = null;
        }
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadPath));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;

        if (s3Client != null) {
            return uploadToS3(file, filename);
        } else {
            return uploadLocal(file, filename);
        }
    }

    private String uploadLocal(MultipartFile file, String filename) {
        try {
            Path targetLocation = Paths.get(uploadPath).resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + filename, e);
        }
    }

    private String uploadToS3(MultipartFile file, String filename) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(filename)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return "https://" + s3Bucket + ".s3.amazonaws.com/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Could not upload file to S3", e);
        }
    }
}
