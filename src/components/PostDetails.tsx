import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Comment } from '../types/Comment';
import { Post } from '../types/Post';
import { Errors } from '../types/Errors';
import { addComments } from './api/comments';

type Props = {
  comments: Comment[];
  post: Post | null;
  isCommentsLoading: boolean;
  commentsError: Errors | null;
  selectedPost: Post | null;
  handleDelete: (value: number) => void;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export const PostDetails: React.FC<Props> = ({
  comments,
  post,
  isCommentsLoading,
  commentsError,
  selectedPost,
  handleDelete,
  setComments,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasNoComments =
    selectedPost &&
    !commentsError &&
    !isCommentsLoading &&
    comments.length === 0;
  const hasComments =
    selectedPost && !commentsError && !isCommentsLoading && comments.length > 0;

  const clearErrors = () => {
    setNameError(false);
    setEmailError(false);
    setBodyError(false);
  };

  const clearForm = () => {
    setUserName('');
    setUserEmail('');
    setCommentBody('');
    clearErrors();
  };

  useEffect(() => {
    setIsClicked(false);
    clearForm();
  }, [selectedPost]);

  const handleFormOpening = () => {
    setIsClicked(current => !current);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    if (nameError) {
      setNameError(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
    if (emailError) {
      setEmailError(false);
    }
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentBody(e.target.value);
    if (bodyError) {
      setBodyError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setNameError(!userName.trim());
    setEmailError(!userEmail.trim());
    setBodyError(!commentBody.trim());

    if (
      !userName.trim() ||
      !userEmail.trim() ||
      !commentBody.trim() ||
      !selectedPost
    ) {
      return;
    }

    setIsSubmitting(true);

    addComments({
      postId: selectedPost?.id,
      name: userName,
      email: userEmail,
      body: commentBody,
    })
      .then((newComment: Comment) => {
        setComments(currentComments => [...currentComments, newComment]);
        setCommentBody('');
        clearErrors();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block" key={post?.id}>
        <h2 data-cy="PostTitle">{`#${post?.id}: ${post?.title}`}</h2>

        <p data-cy="PostBody">{post?.body}</p>
      </div>

      <div className="block">
        {selectedPost && isCommentsLoading && <Loader />}

        {selectedPost && !isCommentsLoading && commentsError && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong
          </div>
        )}

        {hasComments && (
          <>
            <p className="title is-4">Comments:</p>

            {comments.map((comment: Comment) => (
              <article
                className="message is-small"
                data-cy="Comment"
                key={comment.id}
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>
                  <button
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => handleDelete(comment.id)}
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {hasNoComments && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {!isClicked && !isCommentsLoading && !commentsError && (
          <button
            data-cy="WriteCommentButton"
            type="button"
            className="button is-link"
            onClick={handleFormOpening}
          >
            Write a comment
          </button>
        )}
      </div>

      {isClicked && (
        <NewCommentForm
          userName={userName}
          userEmail={userEmail}
          commentBody={commentBody}
          onSubmit={handleSubmit}
          handleNameChange={handleNameChange}
          handleEmailChange={handleEmailChange}
          handleBodyChange={handleBodyChange}
          nameError={nameError}
          emailError={emailError}
          bodyError={bodyError}
          isSubmitting={isSubmitting}
          clearForm={clearForm}
        />
      )}
    </div>
  );
};
