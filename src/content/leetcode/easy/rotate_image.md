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

## Solution

I can think of an algorithm that does this with O(n) space where N is the length of the square.

You can also do this with O(n) space. I don't think that the algorithm would be so different, either.

We are going to need to handle the case of an odd vs even side differently. An odd length means that the center doesn't need to rotate. An even length means everything changes position.

```java

```
