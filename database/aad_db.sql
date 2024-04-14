--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: lobbies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lobbies (
    id integer NOT NULL,
    title character varying NOT NULL,
    creatorid integer NOT NULL,
    totalplayer integer
);


ALTER TABLE public.lobbies OWNER TO postgres;

--
-- Name: lobbies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lobbies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lobbies_id_seq OWNER TO postgres;

--
-- Name: lobbies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lobbies_id_seq OWNED BY public.lobbies.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    wins integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: userstolobbies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userstolobbies (
    user_id integer NOT NULL,
    lobby_id integer NOT NULL,
    suit integer,
    bet integer,
    wins integer,
    username character varying(255)
);


ALTER TABLE public.userstolobbies OWNER TO postgres;

--
-- Name: lobbies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lobbies ALTER COLUMN id SET DEFAULT nextval('public.lobbies_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: lobbies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lobbies (id, title, creatorid, totalplayer) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, username, password, wins) FROM stdin;
17	BRANDONALMARY@HOTMAIL.COM	SERS	$2a$10$LjHJq7NhIOisRZqlW0zSjeJttW.IWfspB6CsoOs75He26L79VY2fm	3
18	TEST@HOTMAIL.COM	TEST1	$2a$10$F8oHLI.m3waXF.h8sTRtZOqpqiiML1kCnCJmm4EwF5F2Xr7SB7i6m	2
12	447521@student.saxion.nl	447521	$2a$10$oxwD/oM4BmP45L2fhD.g3ur.6nQ0gjnS/GDK6cJJNnpdwwXjSfISK	5
\.


--
-- Data for Name: userstolobbies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userstolobbies (user_id, lobby_id, suit, bet, wins, username) FROM stdin;
\.


--
-- Name: lobbies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lobbies_id_seq', 808, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- Name: lobbies lobbies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lobbies
    ADD CONSTRAINT lobbies_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: userstolobbies userstolobbies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userstolobbies
    ADD CONSTRAINT userstolobbies_pkey PRIMARY KEY (user_id, lobby_id);


--
-- PostgreSQL database dump complete
--

