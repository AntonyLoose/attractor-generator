import { calculate_states, combine_equations, create_phase_space } from "./dynamics.js";
import {
    add_point,
    create_camera,
    create_orbit_controls,
    create_point,
    create_renderer,
    create_scene,
    init_three_animation_cycle,
    render_state_at_t
} from "./renderer.js";

const container = document.getElementById("container");
const scene = create_scene();
const renderer = create_renderer(container);
const camera = create_camera(container);
const orbit_controls = create_orbit_controls(camera, renderer);

camera.position.set(0, 0, 100);
orbit_controls.target.set(0, 0, 0);
init_three_animation_cycle(renderer, scene, camera, orbit_controls);

const points = [
    create_point(1, 1, 20)
];

for (const point of points) {
    add_point(point, scene);
}

const t_initial = 0;
const t_step = 0.01;
const sigma = 10;
const rho = 28;
const beta = 8 / 3;
const x = (x, y, _, t_diff) => {
    const dx = sigma * (y - x);
    return x + dx * t_diff;
}
const y = (x, y, z, t_diff) => {
    const dy = x * (rho - z) - y;
    return y + dy * t_diff;
}
const z = (x, y, z, t_diff) => {
    const dz = x * y - beta * z;
    return z + dz * t_diff;
}
const lorenz_system = combine_equations(x, y, z);
const phase_space = create_phase_space(points, t_initial);

let t = t_initial;
let t_prev = t;
let test = true;

if (test) {
    for (let t = 0; t < 1000; t += t_step) {
        t = Math.round(t * 100) / 100;
        const states = calculate_states(phase_space, lorenz_system, t, t_prev);
        phase_space[t] = states;
        t_prev = t;
    }
} else {
    setInterval(() => {
        t = Math.round((t + t_step) * 100) / 100;
        render_state_at_t(phase_space, lorenz_system, points, t, t_prev);
        t_prev = t;
    }, 1000 * t_step);
}
