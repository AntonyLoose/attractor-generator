export function create_phase_space(initial_points, t_initial = 0) {
    const points_map = initial_points
        .map(point => ({ [point.id]: { x: point.x, y: point.y, z: point.z } }))
        .reduce((acc, curr) => ({ ...curr, ...acc }), {});

    return {
        [t_initial]: points_map
    }
}

export function calculate_states(phase_space, equation, t, t_prev) {
    if (phase_space[t]) {
        return phase_space[t];
    }

    const prev_states = phase_space[t_prev];
    if (!prev_states) {
        throw new Error("Trying to calculate state that has no previous calculated state.");
    }

    const states = {};
    for (const id of Object.keys(prev_states)) {
        const { x, y, z } = prev_states[id];
        states[id] = equation(x, y, z, Math.abs(t - t_prev));
    }

    return states;
}

export function combine_equations(x_equation, y_equation, z_equation) {
    return (x, y, z, t_diff) => ({
        x: x_equation(x, y, z, t_diff),
        y: y_equation(y, y, z, t_diff),
        z: z_equation(z, y, z, t_diff)
    })
}

