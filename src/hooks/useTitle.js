import {useEffect} from 'react'

export function useTitle({post}){
    useEffect(() => {
        if(post){
            document.title = post.title;
            document.url = post.thumbImg;
            document.description = `${post.title}, this is a post by ${post.postedBy.name}, enjoy and come back for more :)`;
        } else {
            document.title = `Blogme`;
        }
    });
}