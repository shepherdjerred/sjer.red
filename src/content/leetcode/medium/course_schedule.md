---
title: "Course Schedule"
date: 2024-07-27
leetcode: true
layout: ../../../layouts/BlogLayout.astro
---

## Problem

There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

- For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

Return true if you can finish all courses. Otherwise, return false.

Example 1:

```text
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: There are a total of 2 courses to take.
To take course 1 you should have finished course 0. So it is possible.
```

Example 2:

```text
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take.
To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.
```

Constraints:

- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000
- prerequisites[i].length == 2
- 0 <= ai, bi < numCourses
- All the pairs prerequisites[i] are unique.

## Solution

If the input can be topologically sorted (and thus that the input forms a DAG), then we know that the course schedule is possible.

First try!

```java
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        var indegree = new int[numCourses];
        var matrix = new boolean[numCourses][numCourses];
        for (var pair : prerequisites) {
            var course = pair[0];
            var prereq = pair[1];
            indegree[course] += 1;
            matrix[course][prereq] = true;
        }

        var next = new Stack<Integer>();

        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                next.push(i);
                // mark this node as complete
                indegree[i] = -1;
            }
        }

        while (!next.isEmpty()) {
            var c = next.pop();
            for (int i = 0; i < numCourses; i++) {
                if (matrix[i][c] == true) {
                    indegree[i] -= 1;
                    if (indegree[i] == 0) {
                        indegree[i] = -1;
                        next.push(i);
                    }
                }
            }
        }

        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] != -1) {
                return false;
            }
        }

        return true;
    }
}
```
