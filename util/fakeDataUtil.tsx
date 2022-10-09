import { PartData, PostDataWithNextPrev } from "../interfaces/PostData";
import faker from "faker";

const fakePosts = (): PostDataWithNextPrev[] => {

  var howMany: number = parseInt(process.env.MOCK_DATA_POST_COUNT)
  let parts: PartData[] = [];

  for (let k = 0; k < 5; k++) {
    parts.push({
      Contents: faker.lorem.paragraphs(10, "</br>"),
      Type: 'MARKDOWN',
    })
  }

  let posts: PostDataWithNextPrev[] = [];
  for (let i = 0; i < howMany; i++) {
    posts.push(
      {
        AuthorName: 'Author Name Test',
        PostId: `post-id-${i}`,
        PostShortId: `post-short-id-${i}`,
        Category: 'test',
        CreatedAt: faker.date.recent().toLocaleString(),
        Description:  faker.lorem.words(10),
        ImageKey: `img-${i}`,
        ImageS3Url: "https://picsum.photos/400/600",
        Parts: parts,
        SubTitle: faker.lorem.sentence(),
        Tags: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
        Title: faker.lorem.sentence(),
        IsDraft: false,
        IsNewPost: false
      }
    );
  }

  for (let i = 0; i < posts.length; i++) {
    let prevPostSlug = i > 0 ? `/posts/${posts[i-1].Category}/${posts[i-1].PostId}` : null;
    let prevPostTitle = i > 0 ? posts[i-1].Title : null;
  
    let nextPostSlug = i < posts.length - 1 ? `/posts/${posts[i+1].Category}/${posts[i+1].PostId}`: null;
    let nextPostTitle = i < posts.length - 1 ? posts[i+1].Title : null;
  
    if (prevPostSlug) {
      posts[i].PrevPost = {
        Slug: prevPostSlug,
        Title: prevPostTitle
      }
    }
  
    if (nextPostSlug) {
      posts[i].NextPost = {
        Slug: nextPostSlug,
        Title: nextPostTitle
      }
    }
  }

  return posts;
}

const fakePageViewsBySlug = () => {
  if (process.env.MOCK_DATA && process.env.MOCK_DATA_POST_COUNT) {
    const posts = fakePosts();
    let ret = {};
    for (let i = 0; i < posts.length; i++) {
      ret[`/posts/test/post-id-${i}`] = 12345
    }
    return ret;
  }
}

const fakeSiteConfig = () => {
  return {
    "site": {
      "subject": "This is a Fake Site Subject",
      "baseUrl": "https://fakesite.com",
      "name": "Fake Site",
      "statements": {
        "purpose": {
          "short": "This website is for testing purposes.",
          "long": "This website is for testing purposes. This website is for testing purposes. This website is for testing purposes."
        }
      }
    },
    "categories": [
      {
        "key": "test",
        "label": "Test",
        "description": "See posts with category 'test'."
      },
    ],
    "pageData": {
      "about": {
        "description": "Hi, I'm the about page."
      }
    },
    "featuredSection": {
      "titleText": "Featured Posts",
      "postIds": [
        "post-id-1",
        "post-id-2",
        "post-id-3"
      ]
    },
    "nav": {
      "logoUrl": "https://bit.ly/3SMJzGH",
      "background": {
        "url": "https://bit.ly/3rFYeXY",
        "size": "20rem"
      },
      "links": [
        {
          "label": "Test",
          "href": "/posts/test"
        },
      ]
    },
    "footer": {
      "tagline": "Thanks for reading!"
    },
    "socialMedia": {
      "username": {
        "twitter": "test"
      }
    },
    "faviconUrl": "https://bit.ly/3rHBCqd"
  }
}

export { fakePosts, fakePageViewsBySlug, fakeSiteConfig };
