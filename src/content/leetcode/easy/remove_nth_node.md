---
title: "Remove Nth Node From End of List"
date:
leetcode: true
layout: ../../../layouts/BlogLayout.astro
---

## Problem

Given the head of a linked list, remove the nth node from the end of the list and return its head.

Example 1:

```text
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
```

Example 2:

```text
Input: head = [1], n = 1
Output: []
```

Example 3:

```text
Input: head = [1,2], n = 1
Output: [1]
```

Constraints:

- The number of nodes in the list is sz.
- 1 <= sz <= 30
- 0 <= Node.val <= 100
- 1 <= n <= sz

Follow up: Could you do this in one pass?

## Solution

The straightforward solution to this problem is, well, straightforward. Just iterate through the list until the end to determine the length of the list, then iterate again len - n times and remove the node.

I'll just solve the follow-up because it sounds more challenging/interesting.

We can keep a reference to the last n nodes. The easiest way do to this is a FIFO data structure (queue)

```java

```
