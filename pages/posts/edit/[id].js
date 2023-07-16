import { useState } from "react";

import Router from "next/router";

import Layout from "../../../components/layout";

import axios from "axios";

export async function getServerSideProps({params}){

    // http request
    const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${params.id}`)
    const res = await req.data.data

    return {
        props: {
            post: res
        },
    }

}

function PostEdit(props) {
    const {post} = props

    const [image, setImage] = useState("");
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const [validation, setValidation] = useState({});

    const handleFileChange = (e) => {
        const imageData = e.target.files[0]

        if(!imageData.type.match('image.*')) {
            setImage('');
            return
        }

        setImage(imageData);
    }

    const updatePost = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('image', image);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('_method', 'PUT');

        await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${post.id}`, formData)
        .then(() => {
            Router.push('/posts')
        })
        .catch((error) => {
            setValidation(error.response.data);
        })
    };

    return (
        <Layout>
            <div className="container" style={{ marginTop: '80px' }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card border-0 rounded shadow-sm">
                            <div className="card-body">
                                <form onSubmit={ updatePost }>

                                    <div className="form-group mb-3">
                                        <label className="form-label fw-bold">Image</label>
                                        <input type="file" className="form-control" onChange={handleFileChange}></input>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="form-label fw-bold">TITLE</label>
                                        <input className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masukkan Title"></input>
                                    </div>
                                    {
                                        validation.title &&
                                        <div className="alert alert-danger">
                                            {validation.title}
                                        </div>
                                    }

                                    <div className="form-group mb-3">
                                        <label className="form-label fw-bold">CONTENT</label>
                                        <textarea className="form-control" rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Masukkan Content"></textarea>
                                    </div>
                                    {
                                        validation.content &&
                                        <div className="alert alert-danger">
                                            {validation.content}
                                        </div>
                                    }

                                    <button className="btn btn-primary border-0 shadow-sm" type="submit">
                                        UPDATE
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )

}

export default PostEdit