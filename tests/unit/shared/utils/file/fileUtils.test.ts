import {
  formatFileSize,
  getFileExtension,
  getFileNameWithoutExtension,
  isImageFile,
  isVideoFile,
  isAudioFile,
  isDocumentFile,
  getFileType,
  validateFileSize,
  validateFileType,
} from '@/shared/utils/file/fileUtils';

describe('File Utils', () => {
  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('handles decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2621440)).toBe('2.5 MB');
    });
  });

  describe('getFileExtension', () => {
    it('returns file extension', () => {
      expect(getFileExtension('file.txt')).toBe('txt');
      expect(getFileExtension('image.png')).toBe('png');
      expect(getFileExtension('document.pdf')).toBe('pdf');
    });

    it('handles multiple dots', () => {
      expect(getFileExtension('file.backup.txt')).toBe('txt');
    });

    it('handles no extension', () => {
      expect(getFileExtension('filename')).toBe('');
    });

    it('returns lowercase extension', () => {
      expect(getFileExtension('FILE.TXT')).toBe('txt');
    });
  });

  describe('getFileNameWithoutExtension', () => {
    it('returns filename without extension', () => {
      expect(getFileNameWithoutExtension('file.txt')).toBe('file');
      expect(getFileNameWithoutExtension('image.png')).toBe('image');
    });

    it('handles multiple dots', () => {
      expect(getFileNameWithoutExtension('file.backup.txt')).toBe('file.backup');
    });

    it('handles no extension', () => {
      expect(getFileNameWithoutExtension('filename')).toBe('filename');
    });
  });

  describe('isImageFile', () => {
    it('identifies image files', () => {
      expect(isImageFile('photo.jpg')).toBe(true);
      expect(isImageFile('image.png')).toBe(true);
      expect(isImageFile('graphic.svg')).toBe(true);
    });

    it('rejects non-image files', () => {
      expect(isImageFile('document.pdf')).toBe(false);
      expect(isImageFile('video.mp4')).toBe(false);
    });
  });

  describe('isVideoFile', () => {
    it('identifies video files', () => {
      expect(isVideoFile('movie.mp4')).toBe(true);
      expect(isVideoFile('clip.avi')).toBe(true);
      expect(isVideoFile('video.webm')).toBe(true);
    });

    it('rejects non-video files', () => {
      expect(isVideoFile('photo.jpg')).toBe(false);
      expect(isVideoFile('document.pdf')).toBe(false);
    });
  });

  describe('isAudioFile', () => {
    it('identifies audio files', () => {
      expect(isAudioFile('song.mp3')).toBe(true);
      expect(isAudioFile('audio.wav')).toBe(true);
      expect(isAudioFile('track.ogg')).toBe(true);
    });

    it('rejects non-audio files', () => {
      expect(isAudioFile('video.mp4')).toBe(false);
      expect(isAudioFile('document.pdf')).toBe(false);
    });
  });

  describe('isDocumentFile', () => {
    it('identifies document files', () => {
      expect(isDocumentFile('report.pdf')).toBe(true);
      expect(isDocumentFile('letter.doc')).toBe(true);
      expect(isDocumentFile('spreadsheet.xlsx')).toBe(true);
    });

    it('rejects non-document files', () => {
      expect(isDocumentFile('photo.jpg')).toBe(false);
      expect(isDocumentFile('song.mp3')).toBe(false);
    });
  });

  describe('getFileType', () => {
    it('categorizes files correctly', () => {
      expect(getFileType('photo.jpg')).toBe('image');
      expect(getFileType('video.mp4')).toBe('video');
      expect(getFileType('song.mp3')).toBe('audio');
      expect(getFileType('document.pdf')).toBe('document');
      expect(getFileType('file.unknown')).toBe('other');
    });
  });

  describe('validateFileSize', () => {
    it('validates file size correctly', () => {
      const smallFile = new File(['a'], 'small.txt', { type: 'text/plain' });
      const largeFile = new File([new ArrayBuffer(5 * 1024 * 1024)], 'large.txt', {
        type: 'text/plain',
      });

      expect(validateFileSize(smallFile, 1)).toBe(true);
      expect(validateFileSize(largeFile, 1)).toBe(false);
      expect(validateFileSize(largeFile, 10)).toBe(true);
    });
  });

  describe('validateFileType', () => {
    it('validates file type correctly', () => {
      const txtFile = new File(['content'], 'file.txt', { type: 'text/plain' });
      const pdfFile = new File(['content'], 'file.pdf', { type: 'application/pdf' });

      expect(validateFileType(txtFile, ['txt', 'doc'])).toBe(true);
      expect(validateFileType(txtFile, ['pdf', 'doc'])).toBe(false);
      expect(validateFileType(pdfFile, ['pdf', 'doc'])).toBe(true);
    });
  });
});

