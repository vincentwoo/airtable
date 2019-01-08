This is my submission for the Airtable frontend interview project. You can look at the [finished product](https://vincentwoo.github.io/airtable/) or run it locally. To do so, checkout the product, run `yarn install`, and then `npm run start`.

> How long you spent on the assignment.

Hah, probably like 8 hours, half of which was spent reading about WebGL and other stuff I didn't end up using (like Webpack CSS loaders).

> What you like about your implementation.

Consumers are getting tired of React apps with clean, intuitive design. What users REALLY want is an 80x24 TTY from the 1970s, and I'm going to give it to them.

> What you would change if you were going to do it again.

If I had to build what I built from scratch - do the same thing while skipping the dead ends. I spent a bunch of time on a solution that copied a `<pre>` buffer into a SVG `<foreignObject>` and then from there into a canvas buffer, only to find that this would taint the buffer, which would in turn prevent me from applying the CRT post-processing filter.

If the question is what would I add next, I think the biggest design flaw here is that I don't have a good story for single-day events. We could probably work out a more compact display like:

```
|---First Day---|
  + Single Day Event
  |---Second Day-------|
```

but I didn't really have the time to get into it.

> How you made your design decisions. For example, if you looked at other timelines for inspiration, please note that.

I thought about how I could best comply with the letter and not the spirit of the assignment, and then did that.

> How you would test this if you had more time.

I would never try to test this abomination.
