const projects = window.projects;
const params = new URLSearchParams(window.location.search);
const rawId = Number(params.get("id"));
const projectIndex = Number.isInteger(rawId) && projects[rawId] ? rawId : 0;
const project = projects[projectIndex];

const title = document.querySelector("[data-project-title]");
const category = document.querySelector("[data-project-category]");
const description = document.querySelector("[data-project-description]");
const cover = document.querySelector("[data-project-cover]");
const year = document.querySelector("[data-project-year]");
const role = document.querySelector("[data-project-role]");
const client = document.querySelector("[data-project-client]");
const concept = document.querySelector("[data-project-concept]");
const outcome = document.querySelector("[data-project-outcome]");
const videoSection = document.querySelector("[data-project-video-section]");
const videos = document.querySelector("[data-project-videos]");
const gallery = document.querySelector("[data-project-gallery]");
const prev = document.querySelector("[data-prev-project]");
const next = document.querySelector("[data-next-project]");

document.title = `${project.title} | 案例详情`;
title.textContent = project.title;
category.textContent = `${project.category} / Project Detail`;
description.textContent = project.description;
cover.src = project.image;
cover.alt = project.title;
year.textContent = project.year;
role.textContent = project.role;
client.textContent = project.client;
concept.textContent = project.concept;
outcome.textContent = project.outcome;

const projectVideos = project.videos || (project.video ? [
  {
    title: project.videoTitle || `${project.title} 视频展示`,
    src: project.video,
    poster: project.videoPoster || project.image,
  },
] : []);
const visibleVideos = projectVideos.filter((item) => item.src);

if (visibleVideos.length > 0) {
  videoSection.hidden = false;
  videos.innerHTML = visibleVideos
    .map(
      (item, index) => `
        <figure class="project-video-item">
          <figcaption>${item.title || `视频 ${index + 1}`}</figcaption>
          <video src="${item.src}" poster="${item.poster || project.image}" controls playsinline preload="metadata"></video>
        </figure>
      `
    )
    .join("");
} else {
  videoSection.hidden = true;
  videos.innerHTML = "";
}

gallery.innerHTML = project.gallery
  .map(
    (image, index) => `
      <figure class="gallery-item ${index % 3 === 1 ? "is-portrait" : ""}">
        <img src="${image}" alt="${project.title} 展示图 ${index + 1}" loading="lazy" />
      </figure>
    `
  )
  .join("");

const prevIndex = (projectIndex - 1 + projects.length) % projects.length;
const nextIndex = (projectIndex + 1) % projects.length;
prev.href = `project.html?id=${prevIndex}`;
prev.textContent = `上一个：${projects[prevIndex].title}`;
next.href = `project.html?id=${nextIndex}`;
next.textContent = `下一个：${projects[nextIndex].title}`;
