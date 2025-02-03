STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'app' / 'catalog' / 'static',
] 

INSTALLED_APPS = [
    'compressor',
    'compressor_toolkit',
    'imagekit',
]

# Compressor settings
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True  # For production

# Image compression settings
COMPRESS_FILTERS = {
    'css': ['compressor.filters.css_default.CssAbsoluteFilter'],
    'js': ['compressor.filters.jsmin.JSMinFilter'],
    'img': ['compressor_toolkit.filters.OptipngFilter',  # PNG optimization
            'compressor_toolkit.filters.JpegOptimFilter'],  # JPEG optimization
}

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
]

# Compression quality settings
COMPRESS_JPEG_QUALITY = 80  # 0-100, higher is better quality but larger file
COMPRESS_PNG_OPTIMIZER = 'optipng'  # or 'pngquant' 

# Image processing settings
IMAGEKIT_DEFAULT_CACHEFILE_STRATEGY = 'imagekit.cachefiles.strategies.Optimistic' 