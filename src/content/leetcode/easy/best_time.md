---
title: "Best Time to Buy and Sell Stock II"
date: 2024-06-11
leetcode: true
layout: ../../../layouts/BlogLayout.astro
---

## Problem

You are given an integer array prices where prices[i] is the price of a given stock on the ith day.

On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell it on the same day.

Find and return the maximum profit you can achieve.

Example 1:

```text
Input: prices = [7,1,5,3,6,4]
Output: 7
Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
Total profit is 4 + 3 = 7.
```

Example 2:

```text
Input: prices = [1,2,3,4,5]
Output: 4
Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
Total profit is 4.
```

Example 3:

```text
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: There is no way to make a positive profit, so we never buy the stock to achieve the maximum profit of 0.
```

Constraints:

- 1 <= prices.length <= 3 \* 10^4
- 0 <= prices[i] <= 10^4

## Solution

The key insight here is that we must perform a _buy_ or a _sell_ action every day. There is no option to _hold_/_wait_.

So, all we need to do is answer the question: if I bought yesterday and sold today, would I make a profit, or, is `price[i - 1] < price[i]`.

Loop from the end of the array and perform that comparison. O(n) time, O(1) space.

```java

```
