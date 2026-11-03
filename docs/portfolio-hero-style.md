# Portfolio hero style

Use this when a project is a software app with real screens. Groundwork, Reclaim, and EOB Reader already use it. Nazeer and Soldline should use it once each one has a live app and demo data.

Gleam, DocTalk, Cleaning Price Estimator, Autonomous Cold Email Agent, YouTube Automation Pipeline, and Automated Instagram Carousel Pipeline keep the images they already have. Do not replace those with this frame.

The client recommendation project has no public screens, so it stays without a picture.

## What the hero looks like

A clean light background with a lot of empty space. The desktop screen sits inside a browser window: light bar, three dots, soft shadow. A phone frame overlaps the front right, also with a soft shadow. Both frames show the real app, not a drawing.

The file is 2880 by 1800 pixels. That is 2 times a 1440 by 900 frame, so the card stays sharp. Save it as webp under `public/screenshots/heroes/`.

The card shows that image at a 16 to 10 ratio. The project panel shows the same image first. Older screenshots stay in the gallery under it.

## How to make one

1. Open the live app on demo data. Capture one desktop screen and one phone screen. Use the real interface only.
2. If a person appears, use a male name. Leave out phone numbers.
3. Put the desktop capture in the browser window and the phone capture in the phone frame, overlapping at the front right.
4. Keep the background light and leave space around the frames.
5. Export the composition at 2880 by 1800 and compress it to webp.
6. Set that file as the project `thumbnail`. Add its width and height in `ProjectImage`. Leave the older screenshots in `caseStudy.screenshots`.
