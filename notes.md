# Attractors

## The Question

According to Wolfram: An attractor is a set of states (points in phase space)
invariant under the dynamics, towards which neighbouring states in a
given basin of attraction asymptotically approach in the course of dynamic
evolution. An attractor is defined as the smallest unit which cannot be itself
decomposed into two or more attractors with distinct basins of attraction.
This restriction is necessary since a dynamical system may have multiple
attractors, each with its own basin of attraction.

Write an application that will generate high-fidelity attractors. Enable the
recording / replay of the attractor to any point in time.

---

An application that "generates high-fidelity attractors" first requires a dynamical system - there is no reasonable way
to generate a dynamical system from an attractor. Therefore, my assumption is that the user can input a dynamical system, then
our application will simulate the phase space over time, if an attractor evolves, the human analysing the visualisation will
be able to detect it.

Dynamical systems depend on previous state, that is to say: $f(t)$ requires $f(t-1)$ to be calculated. This rule makes
the "recording / replay of the attractor to any point in time" difficult as all previous states need to be calculated. The
way this question is worded makes me question "any point in time" - does this mean any point in time of the recording?

## Methodology

1. Understand the question - research topics, think about what is being asked
2. Plan the user experience - what is our application trying to be, what is its purpose?
3. Plan the structure of the code - how do we achieve the planned UX, how to we make sure the code is robust and extendable?
4. Test - is it working as expected, are edge cases covered?
5. Deploy - deploy a version on GitHub pages, and package a compressed folder for submission

## Dynamics

The motion of objects in relation to the physical forces that affect them.

## Phase Space

- The phase space of a physical system is the set of all physical states of the system when described by a
  physical parametrisation.
- Each possible state corresponds uniquely to a position in phase space.
- In phase space, each degree of freedom in the system is represented as an orthogonal direction.
- Each point in phase space represents a complete state of the system.
- A systems evolving state traces a path (phase-line) through this multi-dimensional space
- A phase line occurs when there is one degree of freedom - we can use this to see when $\frac{dx}{dy}$ is $+/-$ i.e. when
  change is positive or negative for values of $x$.
- A phase plane occurs when there are two degrees of freedom - an example being position and velocity in the traditional
  mechanics, assuming position is contained to a single line of movement.
- Phase space can easily elucidate qualities of a system that are otherwise unobvious.

## Attractors

- An attractor is a set of states to which a dynamical system tends to evolve for a wide variety of initial conditions.
- Values that get close to the attractor stay close, even if slightly disturbed.
- Attractors show repeating states in a system, this can be useful for predictions and ensuring a system behaves consistently
  and expectantly.
- Let $t$ represent time, and $f(t, \cdot)$ be a function that specifies the dynamics of the system.
- If $a$ is a point in phase space then $f(0, a) = a$, and $f(t, a)$ is the resulting evolved state after $t$ units of time.
- For example, a system that represents the evolution of a free partical in space can be represented as follows:

$$
f(t, (x, v)) = (x + vt, v)
$$

- An attractor $A$ is a subset of the phase space, and is characterised by the following conditions:
  - $A$ is a forward invariant under $f$: if $f(k, a)$ is in $A$, then $f(t \geq k, a)$ is in $A$.
  - There exists a neighbourhood of $A$ called the basin of attraction for $A$ and is denoted $B(A)$, which consists of all the
    points $b$ that enter $A$ in the limit $t->\infty$.
  - There is no proper (non-empty) subset of $A$ having the above two qualities.

### Fixed Point

A single point, think of a bowl, in which you put a marble, the marble will roll to the bottom - in this case, the bowl
is the basin, and the bottom is the attractor.

### Finite Number of Points

In a discrete-time system, an attractor can take the form of a finite number of points that can be visited in sequence. Each
of these points is called a periodic point.

### Limit Cycle

TODO: understand this better

A limit cycle is a periodic orbit of a continuous dynamical system that is isolated. It concerns a cyclic attractor.

### Limit Torus

There may be more than one frequency in a periodic trajectory of the system through the state of the limit cycle. If two
of these frequencies form an irrational number, the trajectory is no longer closed, and the limit cycle becomes a torus.

### Strange

An attractor is called strange if it has a fractal structure. This is often the case when dynamics are chaotic; however, non-chaotic
strange attractors exist.

## UX

- Define an equation
  - Allow selecting some predefined equations
- Specify the step of $t$
- Add initial particles
- Specify life time of particles
  - $t - life time$ => $t$ images shown of each particle, with a fading/gradient effect so that older particles appear more translucent
- Start the system
- Scrub the system to any point that has played previously

## Code Structure

## Sources

- [Phase Space](https://en.wikipedia.org/wiki/Phase_space)
- [Attractors](https://en.wikipedia.org/wiki/Attractor)

