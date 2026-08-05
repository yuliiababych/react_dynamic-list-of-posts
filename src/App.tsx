import React, { useEffect, useState } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import classNames from 'classnames';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { User } from './types/User';
import { getUsers } from './components/api/users';
import { Errors } from './types/Errors';
import { Post } from './types/Post';
import { getPosts } from './components/api/posts';
import { Loader } from './components/Loader';
import { Comment } from './types/Comment';
import { deleteComment, getComments } from './components/api/comments';

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postError, setPostError] = useState<Errors | null>(null);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<Errors | null>(null);

  useEffect(() => {
    getUsers()
      .then((res: User[]) => setUsers(res))
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setPosts([]);
      return;
    };

    setPostError(null);
    setIsPostsLoading(true);

    getPosts(selectedUser.id)
      .then((res: Post[]) => setPosts(res))
      .catch(() => setPostError(Errors.SmthWentWrong))
      .finally(() => setIsPostsLoading(false));
  }, [selectedUser])

  useEffect(() => {
    if (!selectedPost) {
      setComments([]);
      return;
    };

    setCommentsError(null);
    setIsCommentsLoading(true);

    getComments(selectedPost.id)
      .then(setComments)
      .catch(() => setCommentsError(Errors.SmthWentWrong))
      .finally(() => setIsCommentsLoading(false));
  }, [selectedPost]);

  useEffect(() => {
    setSelectedPost(null);
  }, [selectedUser])

  const handleDelete = (commentId: number) => {
    setComments((currentComments: Comment[]) =>
      currentComments.filter(comment => comment.id !== commentId));

    deleteComment(commentId);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  selectedUser={selectedUser}
                  onSelect={setSelectedUser}

                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">
                    No user selected
                  </p>
                )}

                {selectedUser && isPostsLoading && <Loader />}

                {selectedUser && !isPostsLoading && postError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>)}

                {selectedUser && posts.length === 0 && !postError && !isPostsLoading && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {selectedUser && posts.length > 0 && !postError && !isPostsLoading && (
                  <PostsList
                    posts={posts}
                    selectedPost={selectedPost}
                    onSelectedPost={setSelectedPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': selectedPost },
            )}
          >

            <div className="tile is-child box is-success ">
              {selectedPost && (
                <PostDetails
                  post={selectedPost}
                  comments={comments}
                  isCommentsLoading={isCommentsLoading}
                  commentsError={commentsError}
                  selectedPost={selectedPost}
                  handleDelete={handleDelete}
                  setComments={setComments}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
