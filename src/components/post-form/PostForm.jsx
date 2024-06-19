/* eslint-disable react/prop-types */
import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const [loader, setLoader] = useState(false);
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    setLoader(true);
    try {
      let fileId;
      if (data.image && data.image[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);
        fileId = file.$id;
      }

      let postId;
      if (post) {
        if (fileId) {
          await appwriteService.deleteFile(post.featuredImage);
        }
        const updatedPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: fileId || post.featuredImage,
        });

        if (updatedPost) {
          postId = updatedPost.$id;
        }
      } else {
        const newPost = await appwriteService.createPost({
          ...data,
          featuredImage: fileId,
          userId: userData.$id,
        });

        if (newPost) {
          postId = newPost.$id;
        }
      }

      if (postId) {
        navigate(`/post/${postId}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const deletePost = async () => {
    if (post) {
      try {
        setLoader(true);
        await appwriteService.deletePost(post.$id);
        if (post.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage);
        }
        navigate("/");
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  if (loader) {
    return <h1>Blog Posting...</h1>;
  }

  return (
    <div>
      {post && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => navigate(`/post/edit/${post.$id}`)}>Edit</Button>
          <Button onClick={deletePost} className="ml-2 bg-red-500">
            Delete
          </Button>
        </div>
      )}
      <form onSubmit={handleSubmit(submit)} className="flex flex-wrap smallSize">
        <div className="w-2/3 px-2">
          <Input
            label="Title :"
            placeholder="Title"
            className="mb-4"
            {...register("title", { required: true })}
          />
          <Input
            label="Slug :"
            placeholder="Slug"
            className="mb-4"
            {...register("slug", { required: true })}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
          <RTE
            label="Content :"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>
        <div className="w-1/3 px-2">
          <Input
            label="Featured Image :"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
            {...register("image", { required: !post })}
          />
          {post && post.featuredImage && (
            <div className="w-full mb-4">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="rounded-lg"
              />
            </div>
          )}
          <Select
            options={["active", "inactive"]}
            label="Status"
            className="mb-4"
            {...register("status", { required: true })}
          />
          <Button
            type="submit"
            bgColor={post ? "bg-green-500" : undefined}
            className="w-full"
          >
            {post ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
