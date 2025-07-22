# Report

## Introduction

- what I did

## Methodology

I used the following methodology to complete this task:

1. Understand the question - research topics, think about what is being asked
2. Plan the user experience - what is our application trying to be, what is its purpose?
3. Plan the structure of the code - how do we achieve the planned UX, how to we make sure the code is robust and extendable?
4. Test - is it working as expected, are edge cases covered?
5. Deploy - deploy a version on GitHub pages, and package a compressed folder for submission

## Understanding the Question

- When I first read the question I went huh??
- I did not know what the majority of the terms were
- I first researched what an attractor is
- This lead me to dynamics
- Which then lead me to phase space
- I was then able to research attractors and understand what an attractor is
- I then went back to the question, and was still a little bit confused
- How do I "generate" an attractor? An attractor by definition depends on some dynamical system, so first we would need
  a dynamical system
- I assumed "generate" attractors to mean visualise dynamics and thus generate an attractor if it exists
- With this assumption I was able to start planning the UX

## User Experience

- Originally I planned on allowing users to input their own equations, due to time constraints I had to down scale this
  to choosing from preset equations
- the application allows the user to:
  - pick a dynamical system
  - play/pause the generation
  - record some portion of the attractor
  - scrub the recorded portion
- this can definitely be improved, my priority was on the generation of attractors
 
## Implementation

- utility functions for setting up the `three` scene and creating meshes/lines
- we have a single point that "traces" the system
- we keep a trail of points used to draw a line behind the main point
- every tick we:
  - update the position of the main dot
  - add a new point to the trail
  - update the trail, removing old points
  - record the current state of the trail and main point in a dictionary
    where the elapsed time is the key - only if recording is set to true;
- the state is stored in a global variable and passed into these functions
- the state can be updated by the UI components e.g. when the user clicks a different
  system, the initial conditions are set, and the equation is changed
- to enable scrubbing, we record the position of the point every 0.5 seconds (I will discuss
  why the interval is so high in the challenges section)
- a dictionary is used so that we can have O(1) access to the state if we know
  the time
- for more permanent solutions, this dictionary could be recorded to a JSON file and save, this
  would allow for playback in a session without needing to record sections, or calculate the previous
  state (assuming there is a dictionary entry)
- the code can be refactored slightly to enable a headless mode, so that a user can calculate states
  efficiently in a background process - this should be written in a faster language e.g. c
  - the JSON created by the c program could then be imported and used in our JS visualisation

## Limitations

- the obvious issue with dynamical systems is that they can be non-linear, meaning we need the previous value
  to calculate the current value
- this fact means calculating some arbitrary t is a complex problem
- the obvious solution is to have an `update(delta)` function that takes the change in time (`delta`) and the previous state,
  and calculates the new state, if we run this update function $n$ times where $n*delta = t_n$ we can calculate any t
- allowing the user to set `t` adds a layer of complexity - now we have to do it promptly. For non-linear equations, there is
  no nice solution, my best idea is to record states for `t` allowing the user to select any `t < max_calculated_t`
- in my program, this meant adding a "record" feature, which allows the user to record some range of `t`, then play it back
  later. As mentioned previously, a better implementation of this would be to create a headless application in a faster language, we
  could then import the generated dictionaries into our application, allowing users to skip to higher values of `t`
- latency
- my recording feature has significant latency when left on for some time 
- from the pattern of the latency I was able to quickly deduce that the bottle neck is in the following code:

```js
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
```

- the latency pattern would be a slight pause/freeze every ~500ms, which coincides with the insert into the `states` dictionary
- this latency only occurs once the recording has been left on for a while, meaning it happens when the map grows to a large size
- leaving three possibilities:
  - the size of the map is consuming too much memory causing latency
  - the keys of the map are colliding frequently, causing frequent open addressing / map resizes
  - an unknown option I have not considered
- I tried using a JavaScript `Map` as this is more optimised, it led to slightly better performance
- Confused, I reflected on the issue - intuitively the dictionary of states was not large enough to be causing issues
- The open addressing should have an amortised complexity of O(1), and the latency was occurring when there were < 5000 entries
  in the map, I have used larger structures in JS without issues
- That is when I looked at the code again - what if the trail is not being updated correctly?
- I found that old trail values were not being removed from the trail array, the geometry was being updated correctly, the code
  that caused the issue was this:

```ts

```

## Conclusion

