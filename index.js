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

function update_trail(trail, line, delta, max_age_millis) {
    for (const trail_point of trail) {
        trail_point.age += delta;
    }
    trail = trail.filter(point => point.age < max_age_millis);
    line.geometry = create_line_geometry(trail);
}

function update_elapsed(state) {
    const remainder = (state.elapsed) % 500;
    if (remainder === 0 && state.recording) {
        state.states[state.elapsed] = {
            point: JSON.parse(JSON.stringify(state.point)),
            trail: JSON.parse(JSON.stringify(state.trail))
        }
    }

    state.elapsed += state.t_step;
}

function update(delta, state) {
    const { point, line, trail, equation, max_age_millis } = state;
    const { x, y, z } = equation(point.x, point.y, point.z, delta / 1000);
    update_elapsed(state);
    move_point(point, x, y, z);
    add_trail_point(trail, point.x, point.y, point.z);
    update_trail(trail, line, delta, max_age_millis);
}

function lorenz(x, y, z, delta, scale = 1, sigma = 10, rho = 28, beta = 8 / 3) {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = (x * y) - (beta * z)
    return {
        x: x + dx * delta * scale,
        y: y + dy * delta * scale,
        z: z + dz * delta * scale
    }
}

function rossler(x, y, z, delta, scale = 3, a = 0.2, b = 0.2, c = 5.7) {
    const dx = -y - z;
    const dy = x + a * y;
    const dz = b + z * (x - c);
    return {
        x: x + dx * delta * scale,
        y: y + dy * delta * scale,
        z: z + dz * delta * scale
    };
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
    max_age_millis: 10000,
    t_step: 10,
    playing: false,
    elapsed: 0,
    states: {},
    recording: false
}

camera.position.set(state.point.x, state.point.y, state.point.z + 60);
orbit_controls.target.set(state.point.x, state.point.y, state.point.z);
scene.add(state.point.mesh);
scene.add(state.line);
init_three_animation_cycle(renderer, scene, camera, orbit_controls);

setInterval(() => {
    if (state.playing) {
        update(state.t_step, state);
    }
}, state.t_step)


// ---- Setting up components & listeners ---- //

function set_dynamicial_system(system) {
    const { x, y, z } = system.initial_point;
    state.trail = [];
    state.equation = system.equation;
    state.elapsed = 0;
    state.states = {};
    state.recording = false;
    move_point(state.point, x, y, z);
    update(0, state);
    orbit_controls.target.set(x, y, z)
    camera.position.set(x, y, z + 60)
}

function clear_slider(slider) {
    state.states = {};
    slider.max = 0;
    slider.value = 0
    slider.step = 0;
}

const dynamical_systems = {
    lorenz: {
        equation: lorenz,
        initial_point: { x: 1, y: 1, z: 20 }
    },
    rossler: {
        equation: rossler,
        initial_point: { x: 0.1, y: 0.0, z: 0.0 }
    }
};

const dynamics_buttons_container = document.getElementById("dynamics-buttons-container");
for (const key of Object.keys(dynamical_systems)) {
    const system = dynamical_systems[key];
    const button = document.createElement("button");
    button.className = "dynamics-button button";
    button.textContent = key;
    button.onclick = () => {
        set_dynamicial_system(system);
        clear_slider(slider);
    }
    dynamics_buttons_container.appendChild(button);
}

const play_button = document.getElementById("play-button");
play_button.onclick = () => {
    const img = play_button.getElementsByTagName("img")[0];
    state.playing = !state.playing;
    img.src = state.playing ? "./assets/pause.svg" : "./public/play.svg";
};

let times = [];
const record_button = document.getElementById("record-button");
record_button.onclick = () => {
    const img = record_button.getElementsByTagName("img")[0];
    state.recording = !state.recording;
    img.src = state.recording ? "./assets/stop.svg" : "./public/record.svg";

    if (state.recording) {
        clear_slider(slider);
        return;
    }

    times = Object.keys(state.states)
        .map(k => parseFloat(k))
        .sort((a, b) => a - b)
    slider.min = 0;
    slider.max = times.length - 1;
    slider.value = 0;
    slider.step = 1;
};

const slider = document.getElementById("slider");
slider.onchange = (e) => {
    state.playing = false;

    const img = play_button.getElementsByTagName("img")[0];
    img.src = "./assets/play.svg";

    const time = times[e.target.value];
    const prev_state = state.states[time];
    const { x, y, z, age } = prev_state.point;
    const trail = prev_state.trail
    state.elapsed = time;
    state.point.age = age;
    state.trail = trail;

    move_point(state.point, x, y, z);
    update(0, state);
}
