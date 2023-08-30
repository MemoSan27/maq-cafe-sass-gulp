const autoprefixer = require('autoprefixer');

//CSS Y SASS
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');



const css = ( done ) =>{
    //Compilar SASS
    // pasos: 1 - identificar archivo, 2 - compilarla, 3 - Guardar el CSS
    src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss( [ autoprefixer(), cssnano() ] ) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') );

    done();
}

const imagenes = ( ) => {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('build/img') );
}

const versionWebp = () => {
    const opciones = {
        quality: 50
    };
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest('build/img') );
}

const versionAvif = () => {
    const opciones = {
        quality: 50
    };
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('build/img'));
}

const dev = () =>{
    watch( 'src/scss/**/*.scss', css );
    watch( 'src/img/**/*', imagenes );
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp, versionAvif, css, dev );

//series - se inicia una tarea y hasta que finaliza, inicia la siguiente
//paralel - todas las tareas inician al mismo tiempo