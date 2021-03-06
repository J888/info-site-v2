const fs = require("fs");
const faker = require("faker");

const [outPath, filename, numPosts] = process.argv.slice(2);

let posts = [];
for (let i = 0; i < numPosts; i++) {
  let tags = [];
  for (let j = 0; j < 6; j++) {
    tags.push(faker.lorem.word());
  }

  posts.push({
    image: {
      url: 'https://images.squarespace-cdn.com/content/v1/5ec3f9ec664a4a3e7be69928/1592412046459-EUC3FSLII7A9H9OEH044/sinkland-farms-christiansburg-va-pumpkin-festival-portrait-sessions-02-024-edited.jpg?format=2500w',
      s3Url: 'https://images.squarespace-cdn.com/content/v1/5ec3f9ec664a4a3e7be69928/1592412046459-EUC3FSLII7A9H9OEH044/sinkland-farms-christiansburg-va-pumpkin-festival-portrait-sessions-02-024-edited.jpg?format=2500w',
    },
    title: faker.lorem.sentence(),
    id: `${i + 1}-${faker.lorem
      .words(5)
      .substring(1, 20)
      .trim()
      .replaceAll(" ", "-")}`,
    subTitle: faker.lorem.words(6),
    description: faker.lorem.words(10),
    parts: [
      {
        type: 'MARKDOWN',
        fileContents: faker.lorem.paragraphs(10, "</br>")
      },
      {
        type: 'IMAGE',
        url: 'https://images.squarespace-cdn.com/content/v1/5ec3f9ec664a4a3e7be69928/1592412046459-EUC3FSLII7A9H9OEH044/sinkland-farms-christiansburg-va-pumpkin-festival-portrait-sessions-02-024-edited.jpg?format=2500w',
        s3Url: 'https://images.squarespace-cdn.com/content/v1/5ec3f9ec664a4a3e7be69928/1592412046459-EUC3FSLII7A9H9OEH044/sinkland-farms-christiansburg-va-pumpkin-festival-portrait-sessions-02-024-edited.jpg?format=2500w'
      },
      {
        type: 'MARKDOWN',
        fileContents: faker.lorem.paragraphs(10, "</br>")
      },
      {
        type: 'IMAGE',
        url: 'https://images.squarespace-cdn.com/content/v1/5ec3f9ec664a4a3e7be69928/1592412046459-EUC3FSLII7A9H9OEH044/sinkland-farms-christiansburg-va-pumpkin-festival-portrait-sessions-02-024-edited.jpg?format=2500w',
        s3Url: 'https://images.squarespace-cdn.com/content/v1/5ec3f9ec664a4a3e7be69928/1592412046459-EUC3FSLII7A9H9OEH044/sinkland-farms-christiansburg-va-pumpkin-festival-portrait-sessions-02-024-edited.jpg?format=2500w'
      },
      {
        type: 'MARKDOWN',
        fileContents: faker.lorem.paragraphs(10, "</br>")
      }
    ],
    createdAt: faker.date.recent().toLocaleString(),
    tags: tags,
    category: faker.lorem.word()
  });
}

for (let i = 0; i < posts.length; i++) {
  let prevPostSlug = i > 0 ? `/posts/${posts[i-1].category}/${posts[i-1].id}` : null;
  let prevPostTitle = i > 0 ? posts[i-1].title : null;

  let nextPostSlug = i < posts.length - 1 ? `/posts/${posts[i+1].category}/${posts[i+1].id}`: null;
  let nextPostTitle = i < posts.length - 1 ? posts[i+1].title : null;

  if (prevPostSlug) {
    posts[i].prevPost = {
      slug: prevPostSlug,
      title: prevPostTitle
    }
  }

  if (nextPostSlug) {
    posts[i].nextPost = {
      slug: nextPostSlug,
      title: nextPostTitle
    }
  }
}

if (!filename.endsWith(`.json`)) {
  filename += `.json`;
}
fs.writeFileSync(`${outPath}/${filename}`, JSON.stringify(posts, null, 2));
