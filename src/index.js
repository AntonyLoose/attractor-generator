import {
    add_point,
    create_camera,
    create_orbit_controls,
    create_point,
    create_renderer,
    create_scene,
    init_three_animation_cycle
} from "./renderer.js";

const container = document.getElementById("container");
const scene = create_scene();
const renderer = create_renderer(container);
const camera = create_camera(container);
const orbit_controls = create_orbit_controls(camera, renderer);

camera.position.set(0, 0, 10);
orbit_controls.target.set(0, 0, 0);
init_three_animation_cycle(renderer, scene, camera, orbit_controls);

const test_point = create_point(0, 0, 0);
add_point(test_point, scene);
