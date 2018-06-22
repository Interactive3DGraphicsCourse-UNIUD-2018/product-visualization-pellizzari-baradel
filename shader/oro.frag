			varying vec3 vNormal;
			varying vec3 vPosition;
			varying vec3 wPosition;
			varying vec2 uVv;
			uniform vec3 pointLightPosition; // in world space
			//uniform vec3 ambientLight;
			uniform vec3 clight;
			uniform vec3 cspec;
			uniform vec3 cdiff;
			precision highp float;
			precision highp int;
			uniform samplerCube envMap;
			//uniform samplerCube IrrEnvMap;
			uniform float roughness;
			uniform vec2 normalScale;

			const float PI = 3.14159;
			#define saturate(a) clamp( a, 0.0, 1.0 )

			float pow2( const in float x ) { return x*x; }

			float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {
				float maxMIPLevelScalar = float( maxMIPLevel );
				float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );
				return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
			}

			float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
				return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
			}

			vec3 FSchlick(float lDoth) {
				return (cspec + (vec3(1.0)-cspec)*pow(1.0 - lDoth,5.0));
			}

			float DGGX(float nDoth, float alpha) {
				float alpha2 = alpha*alpha;
				float d = nDoth*nDoth*(alpha2-1.0)+1.0;
				return (  alpha2 / (PI*d*d));
			}

			float G1(float dotProduct, float k) {
				return (dotProduct / (dotProduct*(1.0-k) + k) );
			}

			float GSmith(float nDotv, float nDotl) {
				float k = roughness*roughness;
				return G1(nDotl,k)*G1(nDotv,k);
			}

			vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
				return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
			}

			vec3 BRDF_Specular_GGX_Environment( vec3 normal, vec3 viewDir, const in vec3 cspec, const in float roughness ) {

				float dotNV = saturate( dot( normal, viewDir ) );
				const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
				const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
				vec4 r = roughness * c0 + c1;
				float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
				vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
				return cspec * AB.x + AB.y;

			}

			void main() {
				vec4 lPosition = viewMatrix * vec4( pointLightPosition, 1.0 );
				vec3 l = normalize(lPosition.xyz - vPosition.xyz);
				vec3 n = normalize( vNormal );  // interpolation destroys normalization, so we have to normalize
				vec3 v = normalize( -vPosition);
				vec3 h = normalize( v + l);
				vec3 worldN = inverseTransformDirection( n, viewMatrix );
				vec3 worldV = cameraPosition - wPosition ;
				vec3 r = normalize( reflect(-worldV,worldN));
				// small quantity to prevent divisions by 0
				float nDotl = max(dot( n, l),0.000001);
				float lDoth = max(dot( l , h ),0.000001);
				float nDoth = max(dot( n, h ),0.000001);
				float vDoth = max(dot( v, h ),0.000001);
				float nDotv = max(dot( n, v ),0.000001);
				vec3 fresnel = FSchlick(lDoth);

				float blinnShininessExponent = GGXRoughnessToBlinnExponent(roughness);
				float specularMIPLevel = getSpecularMIPLevel(blinnShininessExponent ,8 );

				vec3 BRDF = (vec3(1.0)-fresnel)*cdiff/PI + fresnel*GSmith(nDotv,nDotl)*DGGX(nDoth,roughness*roughness)/
				(4.0*nDotl*nDotv);
				vec3 envLight = textureCubeLodEXT( envMap, vec3(-r.x, r.yz), specularMIPLevel ).rgb;
				envLight = pow(envLight, vec3(2.2));
				vec3 outRadiance = PI* clight * nDotl * BRDF+ envLight*BRDF_Specular_GGX_Environment(n, v, cspec, roughness);
				// gamma encode the final value
				gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), 1.0);
			}
