package com.lms.util;

public final class FileUploadHelper {
    private FileUploadHelper() {
    }

    public static String placeholderUrl(String fileName) {
        return "/uploads/placeholder/" + fileName;
    }
}

