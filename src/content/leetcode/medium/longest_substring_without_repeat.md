---
title: "Group Anagrams"
date: 2024-08-01Z-0700
leetcode: true
layout: ../../../layouts/BlogLayout.astro
---

Given a string s, find the length of the longest substring without repeating characters.

Example 1:

```text
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

Example 2:

```text
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

Example 3:

```text
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
```

Constraints:

- 0 <= s.length <= 5 \* 104
- s consists of English letters, digits, symbols and spaces.

## Solution

I don't really understand this one.

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        var l = 0;
        var m = new HashMap<Character, Integer>();
        var answer = 0;
        for (var r = 0; r < s.length(); r++) {
            var c = s.charAt(r);
            if (m.containsKey(c)) {
                l = Math.max(m.get(c), l);
            }
            m.put(c, r + 1);
            answer = Math.max(r - l + 1, answer);
        }
        return answer;
    }
}
```

### Unoptimized

I think this solution is correct, but it hits a time limit exceeded error

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        var size = s.length();

        while (size > 0) {
            for (var l = 0; l <= s.length() - size; l++) {
                var r = l + size;
                // check if any of the letters in this range are duplicated
                var set = new HashSet<Character>();
                var ok = true;
                for (var c : s.substring(l, r).toCharArray()) {
                    if (set.contains(c)) {
                        ok = false;
                        break;
                    } else {
                        set.add(c);
                    }
                }
                if (ok) {
                    return size;
                }
            }
            size -= 1;
        }

        return size;
    }
}
```
