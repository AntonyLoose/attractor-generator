export function create_phase_space(initial_points, initial_time = 0) {
    const points_map = initial_points
        .map(point => ({ [point.id]: { x: point.x, y: point.y, z: point.z } }))
        .reduce((acc, curr) => ({ ...curr, ...acc }), {});

    return {
        [initial_time]: points_map
    }
}

export function get_states_for_t(t, phase_space) {

}

export function get_state_for_t(t, state_id, phase_space) {

}

export function record_state_for_t(t, state, phase_space) {

}

export function calculate_state(t, state_id, equation, phase_space) {

}

export function combine_equations(x_equation, y_equation, z_equation) {

}

