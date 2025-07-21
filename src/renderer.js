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
    renderer.setSize(container.innerWidth, container.innerHeight);
    container.appendChild(renderer);
    return renderer;
}

export function create_camera(container, fov = 75, near = 0.1, far = 1000) {
    return THREE.PerspectiveCamera(fov, container.innerWidth, container.innerHeight, near, far);
}

export function create_orbit_controls(camera, renderer) {
    return new OrbitControls(camera, renderer.domElement);
}

export function create_point(x, y, z, radius = 1, opacity = 0, width_segments = 8, height_segments = 8) {
    const geometry = new THREE.SphereGeometry(radius, width_segments, height_segments);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, opacity });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);

    return {
        id: crypto.randomUUID(),
        mesh: sphere
    }
}

export function add_point(mesh, scene) {
    scene.add(mesh);
}

export function remove_point(mesh, scene) {
    scene.remove(mesh);
}

export function render_state_at_t(t, phase_space, points) {
    const states = phase_space[t];

    for (const point of points) {
        const state = states[point.id];
        if (!state) {
            throw new Error(`State for point (${point.id}) does not exist.`);
        }

        const { x, y, z } = state;
        point.mesh.position.set(x, y, z);
    }
}
