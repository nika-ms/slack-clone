import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { FC, VFC, useCallback, useState } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  WorkspaceWrapper,
  Workspaces,
} from './style';
import gravatar from 'gravatar';
import Channel from '@pages/Channel';
import DirectMessage from '@pages/DirectMessage';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useinput';
import Modal from '@components/Modal';
import { toast } from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteChannelModal from '@components/InviteChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import DMList from '@components/DMList';

const Workspace: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInvteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const { workspace } = useParams<{ workspace: string }>();

  // ### GET /workspaces/:workspace/channels
  // - :workspace 내부의 내가 속해있는 채널 리스트를 가져옴
  // - return: IChannel[]
  const { data: channelData } = useQuery<IChannel[]>(['channels'], () =>
    axios
      .get(`http://localhost:3095/api/workspaces/${workspace}/channels`, { withCredentials: true })
      .then((res) => res.data)
      .catch((err) => {
        console.dir(err);
        toast.error(err.response?.data, {
          position: 'bottom-center',
        });
      }),
  );

  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useQuery<IUser | false>(['user'], () =>
    axios.get('http://localhost:3095/api/users', { withCredentials: true }).then((res) => res.data),
  );

  const { data: memberData } = useQuery<IUser[]>(['member'], () => {
    return axios
      .get(`http://localhost:3095/api/workspaces/${workspace}/members`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  });

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        refetch();
      });
  }, []);

  const onClickUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickAddWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal((prev) => !prev);
  }, []);

  //   ### POST /workspaces
  //   - 워크스페이스를 생성함
  //   - body: { workspace: string(이름), url: string(주소) }
  //   - return: IWorkspace

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();

      if (!newWorkspace || !newWorkspace.trim()) {
        return;
      }
      if (!newUrl || !newUrl.trim()) {
        return;
      }

      axios
        .post('http://localhost:3095/api/workspaces', {
          workspace: newWorkspace,
          url: newUrl,
        })
        .then((res) => {
          refetch();
          setNewWorkspace('');
          setNewUrl('');
          setShowCreateWorkspaceModal(false);
        })
        .catch((err) => {
          console.log(err.response);
          toast.error(err.response?.data, {
            position: 'bottom-center',
          });
        });
    },
    [newWorkspace, newUrl],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInvteWorkspaceModal(false);
    setShowInvteWorkspaceModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback((e) => {
    e.stopPropagation();
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
    setShowWorkspaceModal(false);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {}, []);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} />
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <ProfileModal>
                <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt=""></img>
                <div>
                  <span id="profile-name">{userData.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
          </span>
        </RightMenu>
      </Header>
      {/* <button onClick={onLogout}>로그아웃</button> */}
      <WorkspaceWrapper>
        <Workspaces>
          {userData.Workspaces.map((item) => {
            return (
              <Link key={item.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{item.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickAddWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Nika</WorkspaceName>
          <MenuScroll>
            <Menu
              show={showWorkspaceModal}
              onCloseModal={toggleWorkspaceModal}
              style={{
                top: 95,
                left: 80,
              }}
            >
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {/* <ChannelList userData={userData} /> */}
            <DMList />
            {/* {channelData?.map((item) => {
              return <div key={item.name}>{item.name}</div>;
            })} */}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInvteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

export default Workspace;
