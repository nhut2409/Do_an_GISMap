<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:ogc="http://www.opengis.net/ogc" xmlns:se="http://www.opengis.net/se" xmlns:xlink="http://www.w3.org/1999/xlink">
	<NamedLayer>
		<Name>
			thongtinnha
		</Name>
		<UserStyle>
			<Name>
				thongtinnha
			</Name>
			<FeatureTypeStyle>
				<Rule>
					<Name>
						rent
					</Name>
					<Description>
						<Title>
							rent
						</Title>
					</Description>
					<Filter xmlns:ogc="http://www.opengis.net/ogc">
						<PropertyIsEqualTo>
							<PropertyName>
								trang_thai
							</PropertyName>
							<Literal>
								rent
							</Literal>
						</PropertyIsEqualTo>
					</Filter>
					<PointSymbolizer>
						<Graphic>
							<Mark>
								<WellKnownName>
									diamond
								</WellKnownName>
								<Fill>
									<SvgParameter name="fill">
										#54b04a
									</SvgParameter>
								</Fill>
								<Stroke>
									<SvgParameter name="stroke">
										#3d8035
									</SvgParameter>
									<SvgParameter name="stroke-width">
										1
									</SvgParameter>
								</Stroke>
							</Mark>
							<Size>
								16
							</Size>
						</Graphic>
					</PointSymbolizer>
				</Rule>
				<Rule>
					<Name>
						sell
					</Name>
					<Description>
						<Title>
							sell
						</Title>
					</Description>
					<Filter xmlns:ogc="http://www.opengis.net/ogc">
						<PropertyIsEqualTo>
							<PropertyName>
								trang_thai
							</PropertyName>
							<Literal>
								sell
							</Literal>
						</PropertyIsEqualTo>
					</Filter>
					<PointSymbolizer>
						<Graphic>
							<Mark>
								<WellKnownName>
									diamond
								</WellKnownName>
								<Fill>
									<SvgParameter name="fill">
										#487bb6
									</SvgParameter>
								</Fill>
								<Stroke>
									<SvgParameter name="stroke">
										#325780
									</SvgParameter>
									<SvgParameter name="stroke-width">
										1
									</SvgParameter>
								</Stroke>
							</Mark>
							<Size>
								16
							</Size>
						</Graphic>
					</PointSymbolizer>
				</Rule>
			</FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>
