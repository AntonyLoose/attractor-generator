import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function init_three_animation_cycle(renderer, scene, camera, orbit_controls) {
    function animate() {
        renderer.render(scene, camera);
        orbit_controls.update();
    }
    renderer.setAnimationLoop(animate);
}

export function create_scene() {
    return new THREE.Scene();
}

export function create_renderer(container) {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    return renderer;
}

export function create_camera(container, fov = 75, near = 0.1, far = 1000) {
    const aspect = container.clientWidth / container.clientHeight
    return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

export function create_orbit_controls(camera, renderer) {
    return new OrbitControls(camera, renderer.domElement);
}

export function create_point(x, y, z, radius = 0.1, opacity = 1, width_segments = 8, height_segments = 8) {
    const geometry = new THREE.SphereGeometry(radius, width_segments, height_segments);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity, transparent: true });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);

    return {
        id: crypto.randomUUID(),
        mesh: sphere,
        x: x,
        y: y,
        z: z,
        age: 0
    }
}
