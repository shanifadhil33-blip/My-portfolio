# Portfolio hero style

Use this when a project is a software app with real screens. Groundwork, Reclaim, and EOB Reader already use it. Nazeer and Soldline should use it once each one has a live app and demo data.

Gleam, DocTalk, Cleaning Price Estimator, Autonomous Cold Email Agent, YouTube Automation Pipeline, and Automated Instagram Carousel Pipeline keep the images they already have. Do not replace those with this frame.

The client recommendation project has no public screens, so it stays without a picture.

## What the hero looks like

Pick the frames that fit how the product is really used. Add a phone only if people use it on a phone. Vary the composition from one project to the next. Do not copy another project's layout.

Groundwork is used on a laptop and a phone, so its hero has both. Reclaim and EOB Reader are desktop tools. Reclaim uses one large browser window, set at a slight angle, on a soft blue background, with the drafted letter as a second card. EOB Reader uses a straight browser window on a soft green background, with a zoomed card of the extracted amounts.

Use real screens from the live app on demo data. Do not draw the interface.

The file is 2880 by 1800 pixels. That is 2 times a 1440 by 900 frame, so the card stays sharp. Save it as webp under `public/screenshots/heroes/`.

The card shows that image at a 16 to 10 ratio. The project panel shows the same image first. Older screenshots stay in the gallery under it.

## How to make one

1. Decide which devices people actually use. Capture only those. A desktop tool does not need a phone.
2. Open the live app on demo data. Use the real interface only.
3. If a person appears, use a male name. Leave out phone numbers.
4. Choose a composition that is not the same as the projects already on the site. Change the angle, the background colour, and what overlaps the window.
5. Export the composition at 2880 by 1800 and compress it to webp.
6. Set that file as the project `thumbnail`. Add its width and height in `ProjectImage`. Leave the older screenshots in `caseStudy.screenshots`.
