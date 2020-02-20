https://f4tornado.github.io/Julia?iterator=mandelbrot&maxnum=25&control=false

# What is it

This thing generates Mandelbrot and Julia sets

## What are those?

Watch this video: https://www.youtube.com/watch?v=FFftmWSzgmk

The mouse controls the mandelbrot set by changing the start location. In the famous mandelbrot set, the starting location is (0, 0), as explained in the video

# How do I use it?

In the URL, you can change the parameters. You can change iterator to mandelbrot (regular mandelbrot set), julia (regular julia set), mandelbrot3 (cubes numbers instead of squaring them), or julia3 (cubes numbers instead of squaring them). Maxnum is the maximum amount of iterations it will do before giving up and saying the number is stable. The higher this is, the slower it will run. Control is whether you can control the set or not. If not, the set will animate in the beginning. Otherwise, the mouse will control the set. Autozoom is whether or not it will zoom automatically, and how much. Set to a number to enable, and don't set it to disable.

If you have control set to true, you can click to change whether you can change the fractal or not, making it easier to zoom.

To zoom, scroll. You will always scroll to where the mouse pointer is located. Right click to reset the view.

When you zoom, the URL will change, which you can copy/paste and it will lock to the location you were zooming to. If you want to copy it so it won't do that, delete the x, y, addx, and addy parameters. It will automatically include autozoom at the end.