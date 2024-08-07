---
title: "Meeting Rooms II"
date: 2024-08-06Z-0700
leetcode: true
layout: ../../../layouts/BlogLayout.astro
---

## Problem

Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.

Example 1:

```text
Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2
```

Example 2:

```text
Input: intervals = [[7,10],[2,4]]
Output: 1
```

Constraints:

- 1 <= intervals.length <= 104
- 0 <= starti < endi <= 106

## Solution

```java
class Solution {
    public int minMeetingRooms(int[][] intervals) {
        // sort input by start
        Arrays.sort(intervals, (l, r) -> {
            return Integer.compare(l[0], r[0]);
        });
        // pq by end
        var pq = new PriorityQueue<int[]>((l, r) -> {
            return Integer.compare(l[1], r[1]);
        });
        var rooms = 0;
        for (var i = 0; i < intervals.length; i++) {
            // remove meetings that have ended
            while (!pq.isEmpty() && pq.peek()[1] <= intervals[i][0]) {
                pq.poll();
            }

            pq.offer(intervals[i]);
            rooms = Math.max(rooms, pq.size());
        }
        return rooms;
    }
}
```
