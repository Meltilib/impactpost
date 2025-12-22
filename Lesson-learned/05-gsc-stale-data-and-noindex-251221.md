# Google Search Console Stale Data & "Noindex" False Alarms

**Date:** 2025-12-21
**Context:** Investigating why new site pages were reported as "Excluded by 'noindex' tag".

## The Issue
The user noticed an error in Google Search Console: "Page is not indexed: Excluded by 'noindex' tag."
However, a code audit revealed absolutely no `noindex` directives in:
- `robots.txt`
- `next.config.ts` headers
- Middleware
- Metadata

## The Findings
Google Search Console data is **not real-time**. The error report was dated Dec 17 (4 days prior).
Since then, the site configuration had likely changed or the initial crawl happened during a transient state (e.g., password protection or maintenance mode).

## Lesson Learned
1.  **Always Verify Live Headers**: Before chasing code "bugs" based on GSC reports, run `curl -I <url>` to see the *current* reality.
    ```bash
    curl -I https://impactpost.ca
    # Look for x-robots-tag
    ```
2.  **Trust the Live Site**: If `curl` says 200 OK and no headers, the GSC report is stale.
3.  **Request Indexing**: The fix is operational (waiting for a re-crawl), not code-based.
