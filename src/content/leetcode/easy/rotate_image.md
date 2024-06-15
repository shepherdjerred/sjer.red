---
title: "Rotate Image"
date: 2024-06-14
leetcode: true
layout: ../../../layouts/BlogLayout.astro
---

## Problem

You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).

You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.

Example 1:

```text
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]
```

Example 2:

```text
Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

Constraints:

- n == matrix.length == matrix[i].length
- 1 <= n <= 20
- -1000 <= matrix[i]\[j] <= 1000

Also, Raymond Chen has a [post](https://devblogs.microsoft.com/oldnewthing/20080902-00/?p=21003) about this.

## Solution

I can think of an algorithm that does this with O(n) space where N is the length of the square.

You can also do this with O(n) space. I don't think that the algorithm would be so different, either.

We are going to need to handle the case of an odd vs even side differently. An odd length means that the center doesn't need to rotate. An even length means everything changes position.

Here's my first attempt. It was mostly working for the problem that I _thought_ I was solving. It would rotate each element in the array by one slot, but it needs to be a complete 90 degree rotation of the image.

```java
class Solution {
    public void rotate(int[][] matrix) {
        var size = matrix.length;
        var shells = (int) Math.floor(size / 2);

        // System.out.println("shells " + shells);

        // this is completely wrong. I misunderstood the problem

        for (var shell = 0; shell < shells; shell++) {
            var tmp = -1001;
            var start = shell;
            var end = size - (shell * 2);

            // System.out.println("shell " + shell);
            // System.out.println("start " + start);
            // System.out.println("end " + end);

            // top row
            for (var x = start; x < end; x++) {
                var tmp2 = matrix[start][x];
                matrix[start][x] = tmp;
                tmp = tmp2;
            }

            for (var row : matrix) {
                System.out.println(Arrays.toString(row));
            }

            // right col
            for (var y = start + 1; y < end; y++) {
                var tmp2 = matrix[y][end - 1];
                matrix[y][end - 1] = tmp;
                tmp = tmp2;
            }

            for (var row : matrix) {
                System.out.println(Arrays.toString(row));
            }

            // bottom row
            for (var x = end - 1; x > 0; x--) {
                var tmp2 = matrix[end - 1][x];
                matrix[end - 1][x] = tmp;
                tmp = tmp2;
            }

            for (var row : matrix) {
                System.out.println(Arrays.toString(row));
            }

            // left col
            for (var y = end - 1; y > 0; y--) {
                var tmp2 = matrix[y][start];
                matrix[y][start] = tmp;
                tmp = tmp2;
            }
        }
    }
}
```

[This Stack Exchange answer](https://stackoverflow.com/a/35438327/3496078) summarizes the approach I came up with. There are more clever solutions using a transpose + rotate (which is also mentioned in that answer).

I'm not familiar with Matrix transpositions. I mean, I've heard the word before, and I think I understood them once in the past, but today I couldn't tell you what it is with confidence.

A transpose is a flip around the diagonal. The algorithm is pretty simple, I think.

- Loop over x,y
  - If x != y, flip coords
- Done!

Time complexity: O(n^2) where `n` is the size of the matrix. The double for loops lead to this measurement.

Space complexity: O(1), we use a constant amount of space

```java
class Solution {
    public void rotate(int[][] matrix) {
        var len = matrix.length;
        // transpose
        for (var x = 0; x < len; x++) {
            for (var y = 0; y < len; y++) {
                // note: this is important otherwise we would double-transpose the matrix
                if (x < y) {
                    continue;
                }

                // swap
                var tmp = matrix[y][x];
                matrix[y][x] = matrix[x][y];
                matrix[x][y] = tmp;
            }
        }

        // reverse rows
        for (var y = 0; y < len; y++) {
            for (var x = 0; x < len; x++) {
                if (x >=  (int) Math.floor(len / 2)) {
                    continue;
                }
                var tmp = matrix[y][x];
                var dst = len - 1 - x;
                matrix[y][x] = matrix[y][dst];
                matrix[y][dst] = tmp;
            }
        }
    }
}
```
