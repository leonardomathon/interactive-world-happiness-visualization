import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';

import { renderer, scene, camera } from '../webgl/scene.js';

export const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const unrealBloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    0.05,
    0,
    0.7
);
composer.addPass(unrealBloomPass);

const filmPass = new FilmPass(0.1, 0.5, 1648, false);
filmPass.renderToScreen = true;
composer.addPass(filmPass);

// PostProcessing for outline mode
const effectGrayScale = new ShaderPass(LuminosityShader);
const effectSobel = new ShaderPass(SobelOperatorShader);
effectSobel.uniforms['resolution'].value.x =
    window.innerWidth * window.devicePixelRatio;
effectSobel.uniforms['resolution'].value.y =
    window.innerHeight * window.devicePixelRatio;

export function toggleSoblePass(preprocessingEffects) {
    if (preprocessingEffects.outlineMode) {
        composer.addPass(effectSobel);
        composer.addPass(effectGrayScale);
    } else {
        composer.removePass(effectSobel);
        composer.removePass(effectGrayScale);
    }
}

// Add film preprocessing
export function toggleFilmPass(preprocessingEffects) {
    if (preprocessingEffects.filmMode) {
        composer.insertPass(filmPass, 1);
    } else {
        composer.removePass(filmPass);
    }
}
