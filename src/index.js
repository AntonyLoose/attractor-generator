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

function create_line(points, color = 0x329CC1) {
    const geometry = create_line_geometry(points);
    const material = new THREE.LineBasicMaterial({ color });
    return new THREE.Line(geometry, material);
}

function create_line_geometry(trail) {
    const points = trail.map(p => new THREE.Vector3(p.x, p.y, p.z));
    return new THREE.BufferGeometry().setFromPoints(points);
}

function move_point(point, x, y, z) {
    point.x = x;
    point.y = y;
    point.z = z;
    point.mesh.position.set(x, y, z);
}

function add_trail_point(trail, x, y, z) {
    const point = create_point(x, y, z);
    trail.push(point);
}

function update_trail(trail, line, delta, max_age_seconds) {
    for (const trail_point of trail) {
        trail_point.age += delta;
    }
    trail = trail.filter(point => point.age < max_age_seconds);
    line.geometry = create_line_geometry(trail);
}

function update(delta, state) {
    const { point, line, trail, equation, max_age_seconds } = state;
    const { x, y, z } = equation(point.x, point.y, point.z, delta);
    move_point(point, x, y, z);
    add_trail_point(trail, point.x, point.y, point.z);
    update_trail(trail, line, delta, max_age_seconds);
}

function lorenz(x, y, z, delta, sigma = 10, rho = 28, beta = 8 / 3) {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = (x * y) - (beta * z)
    return {
        x: x + (dx * delta),
        y: y + (dy * delta),
        z: z + (dz * delta)
    }
}


// ---- Initialising scene ---- //

const container = document.getElementById("container");
const scene = create_scene();
const renderer = create_renderer(container);
const camera = create_camera(container);
const orbit_controls = create_orbit_controls(camera, renderer);
const state = {
    point: create_point(1, 1, 20),
    line: create_line([]),
    trail: [],
    equation: lorenz,
    max_age_seconds: 10,
    t_step: 0.01,
    playing: true
}

camera.position.set(state.point.x, state.point.y, state.point.z + 80);
orbit_controls.target.set(state.point.x, state.point.y, state.point.z);
scene.add(state.point.mesh);
scene.add(state.line);
init_three_animation_cycle(renderer, scene, camera, orbit_controls);

setInterval(() => {
    if (state.playing) {
        update(state.t_step, state);
    }
}, 1000 * state.t_step)


// ---- Attaching listeners ---- //

async function set_dynamicial_system(system) {
    state.point.x = system.initial_point.x;
    state.point.y = system.initial_point.y;
    state.point.z = system.initial_point.z;
    state.trail = [];
    state.equation = system.equation;
}

const dynamical_systems = {
    lorenz: {
        equation: lorenz,
        initial_point: { x: 1, y: 1, z: 20 }
    }
};

const buttons_container = document.getElementById("buttons-container");
for (const key of Object.keys(dynamical_systems)) {
    const system = dynamical_systems[key];
    const button = document.createElement("button");
    button.textContent = key;
    button.onclick = () => {
        set_dynamicial_system(system);
    }
    buttons_container.appendChild(button);
}
