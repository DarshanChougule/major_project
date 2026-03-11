package com.example.foodshop.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtTokenService {

    @Value("${app.security.jwt-secret}")
    private String secret;

    @Value("${app.security.jwt-expiration-mins}")
    private long expirationMins;

    private Key key() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generate(Authentication auth) {
        Instant now = Instant.now();
        Date expiry = Date.from(now.plusSeconds(expirationMins * 60));
        return Jwts.builder()
                .setSubject(auth.getName())
                .setIssuedAt(Date.from(now))
                .setExpiration(expiry)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
}
