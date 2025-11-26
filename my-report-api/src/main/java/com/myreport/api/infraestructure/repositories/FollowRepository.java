package com.myreport.api.infraestructure.repositories;

import com.myreport.api.domain.entities.Follower;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follower, UUID> {

    boolean existsByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    Optional<Follower> findByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    List<Follower> findAllByFollowerId(UUID followerId);

    List<Follower> findAllByFollowingId(UUID followingId);
}