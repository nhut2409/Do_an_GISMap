

CREATE OR REPLACE FUNCTION public.tinh_dien_tich(
	gid_ndc integer)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare 
	dientich NUMERIC;
begin 
	Select st_area((Select geom from ndc where gid= gid_ndc)) into dientich;
	return dientich;
END;
$BODY$;

ALTER FUNCTION public.tinh_dien_tich(integer)
    OWNER TO postgres;



/* Lọc theo xã */
Select * from ndc where ma_xa= '26182'

/* Lọc theo diện tích */
Select *, tinh_dien_tich(gid) from ndc where tinh_dien_tich(gid) >= 20000

                                                                /* Lọc theo xã và diện tích */
Select *, tinh_dien_tich(gid) from ndc where tinh_dien_tich(gid) >= 20000 and ma_xa= '26182'

create function xuat_ndc_qhsd (gid_qhsd int)
	returns table (gid int,object_id int, sh_to int, sh_thua int, loaidat varchar(20), ten_chusd varchar(254), ma_xa varchar(5), geom geometry)
	language 'plpgsql'
as
$$
begin 
	return query 
		select ndc.* from ndc, qhsd where st_intersects(st_buffer(ndc.geom,.1), qhsd.geom) ='t' and qhsd.gid=gid_qhsd;
end;
$$

drop function xuat_ndc_qhsd
select * from xuat_ndc_qhsd(1385)

                                                       /* loc ndc thuoc xa trong vung quy hoach su dung */

create FUNCTION xuat_xa_qhsd ()
(gid_qhsd int, id_maxa char(5))
	returns table (gid int,object_id int, sh_to int, sh_thua int, loaidat varchar(20), ten_chusd varchar(254), ma_xa varchar(5), geom geometry)
	language 'plpgsql'
as
$$
begin 
	return query 
	select ndc.* from ndc, qhsd, xa where st_intersects(st_buffer(ndc.geom,.1), qhsd.geom) ='t' and qhsd.gid=gid_qhsd and xa.ma_xa= id_maxa;
end;
$$

drop function xuat_xa_qhsd
select * from xuat_xa_qhsd(1385,'26182') 
	



/* loc theo qhsd tinh dien tich */

create FUNCTION xuat_qhsd_dientich
(gid_qhsd int, dientich numeric)
	returns table (gid int,object_id int, sh_to int, sh_thua int, loaidat varchar(20), ten_chusd varchar(254), ma_xa varchar(5), geom geometry)
	language 'plpgsql'
as
$$
begin 
	return query 
	select ndc.* from ndc, qhsd where st_intersects(st_buffer(ndc.geom,.1), qhsd.geom) ='t' and qhsd.gid=gid_qhsd and tinh_dien_tich(ndc.gid) <= dientich;
end;
$$

drop function xuat_qhsd_dientich 

select * from xuat_qhsd_dientich(1385, 20000)


								/* loc ndc theo xa, dien tich va qhsd*/

create FUNCTION xuat_ndc_theo_xa_dientich_qhsd
(gid_qhsd int, dientich numeric, maxa char(5))
	returns table (gid int,object_id int, sh_to int, sh_thua int, loaidat varchar(20), ten_chusd varchar(254), ma_xa varchar(5), geom geometry, id_qhsd INTEGER)
	language 'plpgsql'
as
$$
begin 
	return query 
	select ndc.*, qhsd.gid from ndc, qhsd where st_intersects(st_buffer(ndc.geom,.1), qhsd.geom) ='t' and qhsd.gid=gid_qhsd and tinh_dien_tich(ndc.gid) <= dientich and ndc.ma_xa = maxa ;
end;
$$

drop function xuat_ndc_theo_xa_dientich_qhsd

select * from xuat_ndc_theo_xa_dientich_qhsd(1385, 20000, '26182')

                                               -- tim so to, so thua 
CREATE OR REPLACE FUNCTION public.tim_ndc_theo_to_thua(
	so_to integer,
	so_thua integer)
    RETURNS TABLE(gid integer, object_id integer, sh_to integer, sh_thua integer, loaidat character varying, ten_chusd character varying, ma_xa character varying, geom geometry) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
begin 
	return query 
	select ndc.* from ndc where ndc.sh_to = so_to and ndc.sh_thua = so_thua;
end;
$BODY$;

ALTER FUNCTION public.tim_ndc_theo_to_thua(integer, integer)
    OWNER TO postgres;
	
SELECT * from tim_ndc_theo_to_thua(2, 18)

-- tim so to, so thua theo xa 

CREATE FUNCTION tim_ndc_cua_xa_theo_to_thua(so_to integer, so_thua integer, maxa char(5))
returns table (gid int,object_id int, sh_to int, sh_thua int, loaidat varchar(20), ten_chusd varchar(254), ma_xa varchar(5), geom geometry)
	language 'plpgsql'
as
$$
begin 
	return query
	select ndc.* from ndc WHERE ndc.sh_to = so_to and ndc.sh_thua = so_thua and ndc.ma_xa = maxa ;
end;
$$;

drop FUNCTION tim_ndc_cua_xa_theo_to_thua
SELECT * from tim_ndc_cua_xa_theo_to_thua(2, 18, '26182')


-- loc ttnd theo rent hoac sell 

CREATE FUNCTION tim_ttnd_theo_trang_thai
(trangthai char(4))
returns table (id_nha int, tieu_de TEXT, gia money, dien_tich NUMERIC, trang_thai CHARACTER varying(4),hinh_anh text,id_ndc int, geom geometry)
	language 'plpgsql'
as
$$
begin 
	return query
	select * from thongtinnhadat where thongtinnhadat.trang_thai = trangthai /*and (thongtinnhadat.trang_thai = 'sell' or thongtinnhadat.trang_thai = 'rent')*/;
end;
$$;

drop function  tim_ttnd_theo_trang_thai
select * from tim_ttnd_theo_trang_thai('sell')