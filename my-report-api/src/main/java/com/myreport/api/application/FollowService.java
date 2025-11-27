package com.myreport.api.application;

import com.myreport.api.domain.entities.Follower;
import com.myreport.api.infraestructure.repositories.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FollowService {
    @Autowired
    private FollowRepository followRepository;
    @Autowired
    private UserService userService;

    public FollowService(FollowRepository followRepository) {
        this.followRepository = followRepository;
    }

    public Follower follow(UUID followerId, UUID followingId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Você não pode seguir a si mesmo.");
        }

        // Verificar se já segue
        boolean alreadyFollows = followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
        if (alreadyFollows) {
            throw new IllegalStateException("Você já segue esse usuário.");
        }

        var followerUser = userService.getUserById(followerId);
        var following = userService.getUserById(followingId);

        Follower follower = new Follower();
        follower.setId(UUID.randomUUID());
        follower.setFollower(followerUser);
        follower.setFollowing(following);
        follower.setCreatedAt(LocalDateTime.now());

        return followRepository.save(follower);
    }

    public void unfollow(UUID followerId, UUID followingId) {
        Follower follower = followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                .orElseThrow(() -> new IllegalStateException("Você não segue esse usuário."));

        followRepository.delete(follower);
    }

    public List<Follower> getFollowing(UUID userId) {
        return followRepository.findAllByFollowerId(userId);
    }

    public List<Follower> getFollowers(UUID userId) {
        return followRepository.findAllByFollowingId(userId);
    }

    public boolean isFollowing(UUID followerId, UUID followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
}
