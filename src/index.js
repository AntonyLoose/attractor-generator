import {
    create_camera,
    create_orbit_controls,
    create_point,
    create_renderer,
    create_scene,
    init_three_animation_cycle,
} from "./renderer.js";
import * as THREE from "three";

const container = document.getElementById("container");
const scene = create_scene();
const renderer = create_renderer(container);
const camera = create_camera(container);
const orbit_controls = create_orbit_controls(camera, renderer);

camera.position.set(0, 0, 80);
orbit_controls.target.set(1, 1, 20);
init_three_animation_cycle(renderer, scene, camera, orbit_controls);

const states = {};
const point = create_point(1, 1, 20);
const max_age_seconds = 10;
const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(point.x, point.y, point.z)]);
const material = new THREE.LineBasicMaterial({ color: 0xff00ff });
const line = new THREE.Line(geometry, material);
let trail = [];

function update(delta) {
    const x = point.x;
    const y = point.y;
    const z = point.z;

    const dx = 10 * (y - x);
    const dy = x * (28 - z) - y;
    const dz = (x * y) - (8 / 3 * z)

    point.x = x + (dx * delta);
    point.y = y + (dy * delta);
    point.z = z + (dz * delta);

    point.mesh.position.set(point.x, point.y, point.z);

    const trail_point = create_point(x, y, z);
    trail.push(trail_point);

    for (const trail_point of trail) {
        trail_point.age += delta;
    }
    trail = trail.filter(point => point.age < max_age_seconds);

    // When trail length increases beyond previous point count
    geometry.dispose(); // free GPU memory
    line.geometry = new THREE.BufferGeometry().setFromPoints(trail.map(p => new THREE.Vector3(p.x, p.y, p.z)));
}

scene.add(point.mesh);
scene.add(line);

const step = 0.01;
let elapsed = 0;
const elapseds = [0];
setInterval(() => {
    update(step);
    elapsed += step;
    const greatest = elapseds[elapseds.length - 1];
    if (elapsed > greatest) {
        elapseds.push(elapsed);
    }

    states[elapsed] = {
        point: {
            x: point.x,
            y: point.y,
            z: point.z,
            age: point.age
        },
        trail: trail.map(point => ({
            x: point.x,
            y: point.y,
            z: point.z,
            age: point.age
        }))
    }
}, 1000 * step)
